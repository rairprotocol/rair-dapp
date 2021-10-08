pipeline {
  agent { label 'jenkins-slave-node-1' }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('rairtech-dockerhub')
    VERSION = "${env.BUILD_ID}"
    BRANCH = "${env.BRANCH_NAME}"
  }
  stages {
    //stage('Build RAIR frontend') {
    //  steps {
    //    echo 'for branch' + env.BRANCH_NAME
    //    dir("${env.WORKSPACE}/rair-front-master"){
    //      sh 'docker build -t rairtechinc/rairfront:${BRANCH}_0.${VERSION} -t rairtechinc/rairfront:dev_latest --no-cache .'
    //    }
    //  }
    //}
    stage('Build RAIR node') {
      steps {
        echo 'for branch' + env.BRANCH_NAME
        dir("${env.WORKSPACE}/demo-decrypt-node"){
          sh 'docker build -t rairtechinc/rairservernode:${BRANCH}_0.${VERSION} -t rairtechinc/rairservernode:dev_latest .'
        }
      }
    }
    stage('Build minting-network') {
      steps {
        dir("${env.WORKSPACE}/blockchain-demos/frontend-minting-marketplace"){
          sh 'docker build -t rairtechinc/minting-network:${BRANCH}_0.${VERSION} -t rairtechinc/minting-network:dev_latest .'
        }
      }
    }
    stage('Build blockchain-event-listener'){
      steps {
        dir("${env.WORKSPACE}/blockchain-networks-service"){
          sh 'docker build -t rairtechinc/blockchain-event-listener:${BRANCH}_0.${VERSION} -t rairtechinc/blockchain-event-listener:dev_latest .'
        }
      }
    }
    stage('Login') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }
    //stage('Push docker RAIR frontend') {
    //  steps {
    //    sh 'docker push rairtechinc/rairfront:${BRANCH}_0.${VERSION}'
    //    sh 'docker push rairtechinc/rairfront:${BRANCH}_latest'
    //  }
    //}
    stage('Push docker RAIR node') {
      steps {
        sh 'docker push rairtechinc/rairservernode:${BRANCH}_0.${VERSION}'
        sh 'docker push rairtechinc/rairservernode:${BRANCH}_latest'
      }
    }
    stage('Push docker minting-network') {
      steps {
        sh 'docker push rairtechinc/minting-network:${BRANCH}_0.${VERSION}'
        sh 'docker push rairtechinc/minting-network:${BRANCH}_latest'
      }
    }
    stage('Push docker blockchain-event-listener') {
      steps {
        sh 'docker push rairtechinc/blockchain-event-listener:${BRANCH}_0.${VERSION}'
        sh 'docker push rairtechinc/blockchain-event-listener:${BRANCH}_latest'
      }
    }
    stage('Update docker version file') {
      steps {
        dir("${env.WORKSPACE}/demo-decrypt-node") {
          script {
            def data = "0.${VERSION}"
            writeFile(file: 'VERSION', text: data)
          }
        }
      }
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}
