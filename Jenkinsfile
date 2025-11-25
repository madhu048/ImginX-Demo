pipeline {
    agent any

    environment {
        TEAMS_WEBHOOK = 'https://imaginxavr.webhook.office.com/webhookb2/2d47e3e4-7bde-4804-9f1c-07cdc6126f5c@713a5df4-ce37-4131-8bc8-8f2c3415624f/IncomingWebhook/871b1a786fb84b408de72a7954932677/9296219f-afc4-4e8b-9a5c-ad73eb12cb2b/V2uL5xrIWZKlvyE2L9vmA7uzPmmBX2y81OZ7SjVZMHzys1'
    }

    triggers {
        // Schedule: run every 3 hours
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
                // Run tests but don't abort pipeline if they fail
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    bat 'npm ci'
                    bat 'npx playwright install'
                    bat 'npx playwright test --reporter=html --output=playwright-report'
                }
            }
        }

        stage('Publish Report') {
            steps {
                // Always try to publish the report, even if tests failed
                publishHTML([
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: true   // don't break if report is missing
                ])
            }
        }
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'test-results/**', fingerprint: true
            }
        }
    }

    post {
        success {
            bat """
            curl -H "Content-Type: application/json" -d "{\\"@type\\":\\"MessageCard\\",\\"@context\\":\\"http://schema.org/extensions\\",\\"summary\\":\\"ImaginX Website Status\\",\\"themeColor\\":\\"00FF00\\",\\"sections\\":[{\\"activityTitle\\":\\"ImaginX Website: Loading smoothly with all basic content.\\",\\"facts\\":[{\\"name\\":\\"Job\\",\\"value\\":\\"${env.JOB_NAME}\\"},{\\"name\\":\\"Build\\",\\"value\\":\\"${env.BUILD_NUMBER}\\"},{\\"name\\":\\"Status\\",\\"value\\":\\"${currentBuild.currentResult}\\"},{\\"name\\":\\"URL\\",\\"value\\":\\"${env.BUILD_URL}\\"}]}]}" "${TEAMS_WEBHOOK}"
            """
        }
        failure {
            bat """
            curl -H "Content-Type: application/json" -d "{\\"@type\\":\\"MessageCard\\",\\"@context\\":\\"http://schema.org/extensions\\",\\"summary\\":\\"ImaginX Website Status\\",\\"themeColor\\":\\"FF0000\\",\\"sections\\":[{\\"activityTitle\\":\\"ImaginX Website: Having issue with webpage.\\",\\"facts\\":[{\\"name\\":\\"Job\\",\\"value\\":\\"${env.JOB_NAME}\\"},{\\"name\\":\\"Build\\",\\"value\\":\\"${env.BUILD_NUMBER}\\"},{\\"name\\":\\"Status\\",\\"value\\":\\"${currentBuild.currentResult}\\"},{\\"name\\":\\"URL\\",\\"value\\":\\"${env.BUILD_URL}\\"}]}]}" "${TEAMS_WEBHOOK}"
            """
        }
    }
}
