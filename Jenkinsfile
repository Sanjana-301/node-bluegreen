pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-login') 
        IMAGE = "sanjana4047/node-bluegreen"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Sanjana-301/node-bluegreen.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Use Windows variable syntax %VAR%
                bat 'docker build -t %IMAGE%:%BUILD_NUMBER% .'
            }
        }

        stage('Push to Docker Hub') {
            steps {

                bat '''
                powershell -Command "$pass = '%DOCKERHUB_CREDENTIALS_PSW%'; $pass | docker login -u '%DOCKERHUB_CREDENTIALS_USR%' --password-stdin"
                docker push %IMAGE%:%BUILD_NUMBER%
                '''
            }
        }

        stage('Deploy to Green') {
            steps {
                bat '''
                docker stop green || exit 0
                docker rm green || exit 0
                docker run -d --name green -p 8082:3000 %IMAGE%:%BUILD_NUMBER%
                '''
            }
        }

        stage('Health Check Green') {
            steps {
                // Use PowerShell for HTTP check in Windows
                bat 'powershell -Command "try {Invoke-WebRequest -Uri http://localhost:8082 -UseBasicParsing} catch { exit 1 }"'
            }
        }

        stage('Switch Traffic to Green') {
            steps {
                // Use PowerShell to replace text in nginx.conf
                bat '''
                powershell -Command "(Get-Content nginx.conf) -replace 'blue:3000','green:3000' | Set-Content nginx.conf"
                docker restart nginx
                '''
            }
        }

        stage('Shutdown Old (Blue)') {
            steps {
                bat '''
                docker stop blue || exit 0
                docker rm blue || exit 0
                '''
            }
        }
    }

    post {
        always {
            bat 'docker image prune -f'
        }
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check the logs for details."
        }
    }
}
