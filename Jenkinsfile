pipeline {
  agent { label 'jenkins-slave-node-1' }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('rairtech-dockerhub')
  }
  stages {
    stage('Build') {
      steps {
        dir("${env.WORKSPACE}/demo-decrypt-node"){
        sh 'docker build -t rairtechinc/rairservernode:latest .'
        }
      }
    }
    stage('Login') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }
    stage('Push') {
      steps {
        sh 'docker push rairtechinc/rairservernode:latest'
      }
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}
