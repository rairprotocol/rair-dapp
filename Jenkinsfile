pipeline {
  agent { label 'linux' }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('rairtech-dockerhub')
  }
  stages {
    stage('Build') {
      steps {
        sh 'docker build -t rairtechinc/rairservernode:test.latest'
      }
    }
    stage('Login') {
      steps {
        sh 'echo #DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }
    stage('Push') {
      steps {
        sh 'docker push rairtechinc/rairservernode:test.latest'
      }
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}
