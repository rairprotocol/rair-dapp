pipeline {
  agent { label 'jenkins-slave-node-1' }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('rairtech-dockerhub')
  }
  stages {
    stage('Build RAIR node') {
      steps {
        dir("${env.WORKSPACE}/demo-decrypt-node"){
        sh 'docker build -t rairtechinc/rairservernode:latest .'
        }
      }
    }
    stage('Build minting-network') {
      steps {
        dir("${env.WORKSPACE}/blockchain-demos/frontend-minting-marketplace"){
          sh 'docker build -t rairtechinc/minting-network:latest .'
        }
      }
    stage('Login') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }
    stage('Push docker RAIR node') {
      steps {
        sh 'docker push rairtechinc/rairservernode:latest'
      }
    }
    stage('Push docker minting-network') {
      steps {
        sh 'docker push rairtechinc/minting-network:latest'
      }
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}
