pipeline {
  agent { label 'jenkins-slave-node-1' }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('rairtech-dockerhub')
    VERSION = "${env.BUILD_ID}"
    BRANCH = "${env.BRANCH}"
  }
  stages {
    stage('Build RAIR node') {
      steps {
        git branch: "${BRANCH}"
        echo "for branch ${env.BRANCH_NAME}"
        dir("${env.WORKSPACE}/demo-decrypt-node"){
          sh 'docker build -t rairtechinc/rairservernode:${BRANCH}0.${VERSION} .'
        }
      }
    }
    stage('Build minting-network') {
      steps {
        dir("${env.WORKSPACE}/blockchain-demos/frontend-minting-marketplace"){
          sh 'docker build -t rairtechinc/minting-network:${BRANCH}0.${VERSION} .'
        }
      }
    }
    stage('Login') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }
    stage('Push docker RAIR node') {
      steps {
        sh 'docker push rairtechinc/rairservernode:${BRANCH}0.${VERSION}'
      }
    }
    stage('Push docker minting-network') {
      steps {
        sh 'docker push rairtechinc/minting-network:${BRANCH}0.${VERSION}'
      }
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}
