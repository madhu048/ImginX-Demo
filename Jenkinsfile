pipeline {
    agent any

    environment {
        // Store your Teams webhook URL here
        TEAMS_WEBHOOK = 'https://imaginxavr.webhook.office.com/webhookb2/2d47e3e4-7bde-4804-9f1c-07cdc6126f5c@713a5df4-ce37-4131-8bc8-8f2c3415624f/IncomingWebhook/871b1a786fb84b408de72a7954932677/9296219f-afc4-4e8b-9a5c-ad73eb12cb2b/V2uL5xrIWZKlvyE2L9vmA7uzPmmBX2y81OZ7SjVZMHzys1'
    }

    triggers {
        // Schedule: run every 3 hours
        cron('H */3 * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                // Replace with your Git repo URL and branch
                git branch: 'main', url: 'https://github.com/madhu048/ImginX-Demo.git'
            }
        }

        stage('Install & Test') {
            steps {
                // Run all commands needed for Playwright
                bat '''
                    npm ci
                    npx playwright install
                    npx playwright test --reporter=html
                '''
            }
        }

        stage('Publish Report') {
            steps {
                // Publish Playwright HTML report in Jenkins
                publishHTML([
                    reportDir: 'playwright-report',   // folder where Playwright puts HTML report
                    reportFiles: 'index.html',        // entry file
                    reportName: 'Playwright Report',  // name shown in Jenkins UI
                    keepAll: true,                    // keep reports for each build
                    alwaysLinkToLastBuild: true,      // link to latest report
                    allowMissing: false               // fail if report is missing
                ])
            }
        }
    }

    post {
        success {
            bat """
            curl -H "Content-Type: application/json" -d "{\\"@type\\":\\"MessageCard\\",\\"@context\\":\\"http://schema.org/extensions\\",\\"summary\\":\\"ImaginX Website Status\\",\\"themeColor\\":\\"00FF00\\",\\"sections\\":[{\\"activityTitle\\":\\"Build succeeded.\\",\\"facts\\":[{\\"name\\":\\"Job\\",\\"value\\":\\"${env.JOB_NAME}\\"},{\\"name\\":\\"Build\\",\\"value\\":\\"${env.BUILD_NUMBER}\\"},{\\"name\\":\\"Status\\",\\"value\\":\\"${currentBuild.currentResult}\\"},{\\"name\\":\\"URL\\",\\"value\\":\\"${env.BUILD_URL}\\"}]}]}" "${TEAMS_WEBHOOK}"
            """
        }
        failure {
            bat """
            curl -H "Content-Type: application/json" -d "{\\"@type\\":\\"MessageCard\\",\\"@context\\":\\"http://schema.org/extensions\\",\\"summary\\":\\"ImaginX Website Status\\",\\"themeColor\\":\\"FF0000\\",\\"sections\\":[{\\"activityTitle\\":\\"Build failed.\\",\\"facts\\":[{\\"name\\":\\"Job\\",\\"value\\":\\"${env.JOB_NAME}\\"},{\\"name\\":\\"Build\\",\\"value\\":\\"${env.BUILD_NUMBER}\\"},{\\"name\\":\\"Status\\",\\"value\\":\\"${currentBuild.currentResult}\\"},{\\"name\\":\\"URL\\",\\"value\\":\\"${env.BUILD_URL}\\"}]}]}" "${TEAMS_WEBHOOK}"
            """
        }
    }
}
