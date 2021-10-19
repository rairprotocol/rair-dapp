pipeline {
  agent { label 'jenkins-slave-node-1' }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('rairtech-dockerhub')
    VERSION = "${env.BUILD_ID}"
    BRANCH = "${env.BRANCH_NAME}"
    PROJECT_ID = 'rair-314019'
    CLUSTER = 'staging-1'
    LOCATION = 'us-central1-c'
    CREDENTIALS_ID = 'rair-314019'
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
          sh 'docker build -t rairtechinc/rairservernode:${BRANCH}_0.${VERSION} -t rairtechinc/rairservernode:${BRANCH}_latest .'
        }
      }
    }
    stage('Build minting-network') {
      steps {
        dir("${env.WORKSPACE}/blockchain-demos/frontend-minting-marketplace"){
          sh 'docker build -t rairtechinc/minting-network:${BRANCH}_0.${VERSION} -t rairtechinc/minting-network:${BRANCH}_latest .'
        }
      }
    }
    stage('Build blockchain-event-listener'){
      steps {
        dir("${env.WORKSPACE}/blockchain-networks-service"){
          sh 'docker build -t rairtechinc/blockchain-event-listener:${BRANCH}_0.${VERSION} -t rairtechinc/blockchain-event-listener:${BRANCH}_latest .'
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
    stage('Deploy to k8s'){
      when { branch 'dev' }
      steps {
        sh("sed -i.bak 's#dev_latest#${BRANCH}_0.${VERSION}#' ${env.WORKSPACE}/kubernetes-manifests/manifests/dev-manifest/*.yaml")
        step([$class: 'KubernetesEngineBuilder', namespace: "default", projectId: env.PROJECT_ID, clusterName: env.CLUSTER, zone: env.LOCATION, manifestPattern: 'kubernetes-manifests/manifests/dev-manifest', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
    }
  }
}
  post {
    always {
      sh 'docker logout'
    }
  }
}
