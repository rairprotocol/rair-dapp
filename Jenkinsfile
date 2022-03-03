pipeline {
  agent   {
        kubernetes {
            label 'jenkins-agent'
            yaml """
    kind: Pod
    spec:
      containers:
      - name: kaniko
        image: gcr.io/kaniko-project/executor:debug
        command:
        - /busybox/cat
        tty: true
        volumeMounts:
        - name: kaniko-secret
          mountPath: /kaniko/.docker
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
    stage('Build and push rairnode') {
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./rairnode/ \
                    --verbosity debug \
                    --insecure \
                    --skip-tls-verify \
                    --destination rairtechinc/rairservernode:${BRANCH}_1.${VERSION} \
                    --destination rairtechinc/rairservernode:latest \
                    --destination rairtechinc/rairservernode:${GIT_COMMIT}
                '''
              }

            }
          }
        }
    stage('Build and push rairnode') {
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./minting-network/ \
                    --verbosity debug \
                    --insecure \
                    --skip-tls-verify \
                    --destination rairtechinc/minting-network:${BRANCH}_1.${VERSION} \
                    --destination rairtechinc/minting-network:latest \
                    --destination rairtechinc/minting-network:${GIT_COMMIT}
                '''
              }

            }
          }
        }
    stage('Build and push rairnode') {
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./blockchain-networks-service/ \
                    --verbosity debug \
                    --insecure \
                    --skip-tls-verify \
                    --destination rairtechinc/blockchain-event-listener:${BRANCH}_1.${VERSION} \
                    --destination rairtechinc/blockchain-event-listener:latest \
                    --destination rairtechinc/blockchain-event-listener:${GIT_COMMIT}
                '''
              }

            }
          }
        }
  }
}
