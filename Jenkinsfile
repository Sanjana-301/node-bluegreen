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
                bat 'docker build -t $IMAGE:$BUILD_NUMBER .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                bat 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                bat 'docker push $IMAGE:$BUILD_NUMBER'
            }
        }

        stage('Deploy to Green') {
            steps {
                bat '''
                docker stop green || true
                docker rm green || true
                docker run -d --name green -p 8082:3000 $IMAGE:$BUILD_NUMBER
                '''
            }
        }

        stage('Health Check Green') {
            steps {
                bat 'curl -f http://localhost:8082 || (echo "Health check failed!" && exit 1)'
            }
        }

        stage('Switch Traffic to Green') {
            steps {
                bat '''
                sed -i 's/blue:3000/green:3000/' nginx.conf
                docker restart nginx
                '''
            }
        }

        stage('Shutdown Old (Blue)') {
            steps {
                bat '''
                docker stop blue || true
                docker rm blue || true
                '''
            }
        }
    }
}
