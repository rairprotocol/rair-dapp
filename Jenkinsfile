pipeline {
  agent   {
        kubernetes {
            label 'jenkins-agent'
            yaml """
kind: Pod
metadata:
  name: jenkins-agent
spec:
  containers:
  - name: golang
    image: golang:1.12
    command:
    - cat
    tty: true
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    imagePullPolicy: Always
    command:
    - /busybox/cat
    tty: true
"""
        }
    }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('rairtech-dockerhub')
    VERSION = "${env.BUILD_ID}"
    BRANCH = "${env.BRANCH_NAME}"
    DEV_PROJECT_ID = 'rair-market'
    DEV_CLUSTER = 'dev'
    DEV_LOCATION = 'us-east1-b'
    CREDENTIALS_ID = 'rair-market'
    MAIN_PROJECT_ID = "rair-market" 
    MAIN_CLUSTER = "staging"
    MAIN_LOCATION = "southamerica-west1-a"
  }
    stages{
     stage('Initialize'){
       steps{
        def dockerHome = tool 'Docker-Installation'
        env.PATH = "${dockerHome}/bin:${env.PATH}"
      }
     }
    stage('Build RAIR node') {
      steps {
        echo 'for branch' + env.BRANCH_NAME
        dir("${env.WORKSPACE}/rairnode"){
          sh 'docker build -t rairtechinc/rairservernode:${BRANCH}_1.${VERSION} -t rairtechinc/rairservernode:${BRANCH}_latest -t rairtechinc/rairservernode:${GIT_COMMIT} .'
        }
      }
    }
    stage('Build minting-network') {
      steps {
        dir("${env.WORKSPACE}/minting-marketplace"){
          sh 'docker build -t rairtechinc/minting-network:${BRANCH}_1.${VERSION} -t rairtechinc/minting-network:${BRANCH}_latest -t rairtechinc/minting-network:${GIT_COMMIT} .'
        }
      }
    }
    stage('Build blockchain-event-listener'){
      steps {
        dir("${env.WORKSPACE}/blockchain-networks-service"){
          sh 'docker build -t rairtechinc/blockchain-event-listener:${BRANCH}_1.${VERSION} -t rairtechinc/blockchain-event-listener:${BRANCH}_latest -t rairtechinc/blockchain-event-listener:${GIT_COMMIT} .'
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
        sh 'docker push rairtechinc/rairservernode:${BRANCH}_1.${VERSION}'
        sh 'docker push rairtechinc/rairservernode:${BRANCH}_latest'
        sh 'docker push rairtechinc/rairservernode:${GIT_COMMIT}'
      }
    }
    stage('Push docker minting-network') {
      steps {
        sh 'docker push rairtechinc/minting-network:${BRANCH}_1.${VERSION}'
        sh 'docker push rairtechinc/minting-network:${BRANCH}_latest'
        sh 'docker push rairtechinc/minting-network:${GIT_COMMIT}'
      }
    }
    stage('Push docker blockchain-event-listener') {
      steps {
        sh 'docker push rairtechinc/blockchain-event-listener:${BRANCH}_1.${VERSION}'
        sh 'docker push rairtechinc/blockchain-event-listener:${BRANCH}_latest'
        sh 'docker push rairtechinc/blockchain-event-listener:${GIT_COMMIT}'
      }
    }
    stage('Update docker version file') {
      steps {
        dir("${env.WORKSPACE}/rairnode") {
          script {
            def data = "0.${VERSION}"
            writeFile(file: 'VERSION', text: data)
          }
        }
      }
    }
    stage('Deploy to k8s dev'){
      when { branch 'dev' }
      steps {
        sh("sed -i.bak 's#dev_latest#${GIT_COMMIT}#' ${env.WORKSPACE}/kubernetes-manifests/dev-manifest/*.yaml")
        step([$class: 'KubernetesEngineBuilder', namespace: "default", projectId: env.DEV_PROJECT_ID, clusterName: env.DEV_CLUSTER, zone: env.DEV_LOCATION, manifestPattern: 'kubernetes-manifests/dev-manifest', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
    }
    }
    stage('Deploy to k8s staging'){
      when { branch 'main' }
      steps {
        sh("sed -i.bak 's#main_latest#${GIT_COMMIT}#' ${env.WORKSPACE}/kubernetes-manifests/staging-manifest/*.yaml")
        step([$class: 'KubernetesEngineBuilder', namespace: "default", projectId: env.MAIN_PROJECT_ID, clusterName: env.MAIN_CLUSTER, zone: env.MAIN_LOCATION, manifestPattern: 'kubernetes-manifests/staging-manifest', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
    }
  }
}
  post {
    always {
      sh 'docker logout'
    }
  }
}
