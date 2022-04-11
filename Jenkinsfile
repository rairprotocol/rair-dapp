pipeline {
  agent   {
        kubernetes {
            label 'jenkins-agent'
            yaml """
    kind: Pod
    spec:
      containers:
      - name: kubectl
        image: joshendriks/alpine-k8s
        command:
        - /bin/cat
        tty: true
      - name: kaniko
        image: gcr.io/kaniko-project/executor:debug
        command:
        - /busybox/cat
        tty: true
        volumeMounts:
        - name: kaniko-secret
          mountPath: /kaniko/.docker
        resources:
          limits:
            memory: 8Gi
          requests:
            memory: 4Gi
            cpu: 2
      restartPolicy: Never
      volumes:
      - name: kaniko-secret
        secret:
            secretName: regcred
            items:
            - key: .dockerconfigjson
              path: config.json
"""
        }
    }
  environment {
    //DOCKERHUB_CREDENTIALS = credentials('rairtech-dockerhub')
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
    stage('Build and push rairnode') {
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./rairnode/ \
                    --verbosity debug \
                    --destination rairtechinc/rairservernode:latest \
                    --destination rairtechinc/rairservernode:${GIT_COMMIT} \
                    --destination rairtechinc/rairservernode:${GIT_BRANCH}_1.${BUILD_ID}
                '''
              }

            }
          }
        }
    stage('Build and push minting-marketplace') {
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./minting-marketplace/ \
                    --verbosity debug \
                    --destination rairtechinc/minting-network:latest \
                    --destination rairtechinc/minting-network:${GIT_COMMIT} \
                    --destination rairtechinc/minting-network:${GIT_BRANCH}_1.${BUILD_ID}
                '''
              }

            }
          }
        }
    stage('Build and push event-listener') {
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./blockchain-networks-service/ \
                    --verbosity debug \
                    --destination rairtechinc/blockchain-event-listener:latest \
                    --destination rairtechinc/blockchain-event-listener:${GIT_COMMIT} \
                    --destination rairtechinc/blockchain-event-listener:${GIT_BRANCH}_1.${BUILD_ID}
                '''
              }

            }
          }
        }
    stage('Deploy configmap to dev k8s environment'){
      when { branch 'dev' }
      steps {
        container('kubectl') {
        step([$class: 'KubernetesEngineBuilder', 
        namespace: "default", 
        projectId: env.DEV_PROJECT_ID, 
        clusterName: env.DEV_CLUSTER, 
        zone: env.DEV_LOCATION, 
        manifestPattern: 'kubernetes-manifests/configmaps/environment/dev', 
        credentialsId: env.CREDENTIALS_ID])
    }
      }
    }
    stage('Deploy k8s'){
      when { branch 'dev' }
      steps {
        container('kubectl') {
        sh("sed -i.bak 's#dev_latest#${GIT_COMMIT}#' ${env.WORKSPACE}/kubernetes-manifests/dev-manifest/*.yaml")
        step([$class: 'KubernetesEngineBuilder', 
        namespace: "default", 
        projectId: env.DEV_PROJECT_ID, 
        clusterName: env.DEV_CLUSTER, 
        zone: env.DEV_LOCATION, 
        manifestPattern: 'kubernetes-manifests/dev-manifest', 
        credentialsId: env.CREDENTIALS_ID, 
        verifyDeployments: true])
    }
      }
    }
    stage('Deploy configmap to staging k8s environment'){
      when { branch 'main' }
      steps {
        container('kubectl') {
        step([$class: 'KubernetesEngineBuilder', 
        namespace: "default", 
        projectId: env.MAIN_PROJECT_ID, 
        clusterName: env.MAIN_CLUSTER, 
        zone: env.MAIN_LOCATION, 
        manifestPattern: 'kubernetes-manifests/configmaps/environment/staging', 
        credentialsId: env.CREDENTIALS_ID])
    }
      }
    }
    stage('Deploy to k8s staging'){
      when { branch 'main' }
      steps {
        sh("sed -i.bak 's#latest#${GIT_COMMIT}#' ${env.WORKSPACE}/kubernetes-manifests/staging-manifest/*.yaml")
        step([$class: 'KubernetesEngineBuilder', 
        namespace: "default", 
        projectId: env.MAIN_PROJECT_ID, 
        clusterName: env.MAIN_CLUSTER, zone: 
        env.MAIN_LOCATION, 
        manifestPattern: 'kubernetes-manifests/staging-manifest', 
        credentialsId: env.CREDENTIALS_ID, 
        verifyDeployments: true])
    }
  }
}
}
