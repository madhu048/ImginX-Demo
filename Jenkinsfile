pipeline {
    agent any
 
    environment {
        TEAMS_WEBHOOK = 'https://imaginxavr.webhook.office.com/webhookb2/2d47e3e4-7bde-4804-9f1c-07cdc6126f5c@713a5df4-ce37-4131-8bc8-8f2c3415624f/IncomingWebhook/871b1a786fb84b408de72a7954932677/9296219f-afc4-4e8b-9a5c-ad73eb12cb2b/V2uL5xrIWZKlvyE2L9vmA7uzPmmBX2y81OZ7SjVZMHzys1'
    }
 
    triggers {
        cron('H */3 * * *')
    }
 
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/madhu048/ImginX-Demo.git'
            }
        }
 
        stage('Install & Test') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    bat 'npm ci'
                    bat 'npx playwright install'
                    bat 'npx playwright test --reporter=html,json --output=playwright-report'
                }
            }
        }
 
        stage('Publish Report') {
            steps {
                publishHTML([
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: true
                ])
 
                // Copy test-results directory if exists (Windows-safe)
                bat 'if exist test-results (xcopy test-results playwright-report\\test-results /E /I /Y)'
            }
        }
 
        stage('Collect Failed URLs') {
            steps {
                script {
                    def testedUrl = readFile "tested_url.txt"
 
                    // Playwright JSON output file
                    def jsonPath = "playwright-report/data.json"
 
                    def results = readJSON file: jsonPath
 
                    def failedUrls = []
 
                    results.suites.each { suite ->
                        suite.specs.each { spec ->
                            spec.tests.each { test ->
                                if (test.status == 'failed') {
                                    test.attachments.each { att ->
                                        if (att.name == 'failed-url') {
                                            failedUrls << new String(att.body)
                                        }
                                    }
                                }
                            }
                        }
                    }
 
                    env.FAILED_URLS = failedUrls.join(', ')
                    env.TESTED_URL = testedUrl
                }
            }
        }
 
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'test-results/**,playwright-report/**,tested_url.txt', fingerprint: true
            }
        }
    }
 
    post {
        success {
            bat """
            curl -H "Content-Type: application/json" -d "{\\"@type\\":\\"MessageCard\\",\\"@context\\":\\"http://schema.org/extensions\\",\\"summary\\":\\"ImaginX Website Status\\",\\"themeColor\\":\\"00FF00\\",\\"sections\\":[{\\"activityTitle\\":\\"ImaginX Website: Loaded Successfully!\\",\\"facts\\":[{\\"name\\":\\"Job\\",\\"value\\":\\"${env.JOB_NAME}\\"},{\\"name\\":\\"Build\\",\\"value\\":\\"${env.BUILD_NUMBER}\\"},{\\"name\\":\\"Status\\",\\"value\\":\\"SUCCESS\\"},{\\"name\\":\\"URL Tested\\",\\"value\\":\\"${TESTED_URL}\\"}]}]}" "${TEAMS_WEBHOOK}"
            """
        }
 
        failure {
            bat """
            curl -H "Content-Type: application/json" -d "{\\"@type\\":\\"MessageCard\\",\\"@context\\":\\"http://schema.org/extensions\\",\\"summary\\":\\"ImaginX Website Status\\",\\"themeColor\\":\\"FF0000\\",\\"sections\\":[{\\"activityTitle\\":\\"⚠️ ImaginX Website Test Failed\\",\\"facts\\":[{\\"name\\":\\"Job\\",\\"value\\":\\"${env.JOB_NAME}\\"},{\\"name\\":\\"Build\\",\\"value\\":\\"${env.BUILD_NUMBER}\\"},{\\"name\\":\\"Status\\",\\"value\\":\\"FAILURE\\"},{\\"name\\":\\"URL Tested\\",\\"value\\":\\"${TESTED_URL}\\"},{\\"name\\":\\"Failed URLs\\",\\"value\\":\\"${env.FAILED_URLS}\\"}]}]}" "${TEAMS_WEBHOOK}"
            """
        }
    }
}
