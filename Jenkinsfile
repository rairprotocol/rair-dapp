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
        image: gcr.io/kaniko-project/executor:v1.3.0-debug
        command:
        - /busybox/cat
        tty: true
        volumeMounts:
        - name: kaniko-secret
          mountPath: /kaniko/.docker
        resources:
          limits:
            memory: 16Gi
          requests:
            memory: 8Gi
            cpu: 4
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
    DEV_PROJECT_ID = 'rair-market-dev'
    DEV_CLUSTER = 'primary'
    DEV_LOCATION = 'us-west1-a'
    CREDENTIALS_ID = 'rair-market-dev'
    MAIN_PROJECT_ID = "rair-market-dev"
    MAIN_CLUSTER = "staging"
    MAIN_LOCATION = "southamerica-west1-a"
  }
  stages{
    stage('Build and push minting-marketplace') {
          when {
            not { branch 'dev'}
          }
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile.prod \
                    --context ./minting-marketplace/ \
                    --verbosity debug \
                    --cleanup \
                    --destination rairtechinc/minting-network:latest \
                    --destination rairtechinc/minting-network:${GIT_COMMIT}
                '''
              }

            }
          }
        }
    stage('Build and push rairnode') {
          when {
            not { branch 'dev'}
          }
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./rairnode/ \
                    --verbosity debug \
                    --cleanup \
                    --destination rairtechinc/rairservernode:latest \
                    --destination rairtechinc/rairservernode:${GIT_COMMIT}
                '''
              }

            }
          }
        }
    stage('Build and push rairnode new-infra') {
          when {
            not { branch 'dev'}
          }
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile.prod \
                    --context ./rairnode/ \
                    --verbosity debug \
                    --cleanup \
                    --destination rairtechinc/rairservernode-new-infra:latest \
                    --destination rairtechinc/rairservernode-new-infra:${GIT_COMMIT}
                '''
              }
            }
          }
        }
    stage('Build and push event-listener') {
          when {
            not { branch 'dev'}
          }
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./blockchain-networks-service/ \
                    --verbosity debug \
                    --cleanup \
                    --destination rairtechinc/blockchain-event-listener:latest \
                    --destination rairtechinc/blockchain-event-listener:${GIT_COMMIT}
                '''
              }

            }
          }
        }
    stage('Build and push event-listener new infra') {
          when {
            not { branch 'dev'}
          }
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile.prod \
                    --context ./blockchain-networks-service/ \
                    --verbosity debug \
                    --cleanup \
                    --destination rairtechinc/blockchain-event-listener-new-infra:latest \
                    --destination rairtechinc/blockchain-event-listener-new-infra:${GIT_COMMIT}
                '''
              }

            }
          }
        }
    stage('Build and push media-service') {
          when {
            not { branch 'dev'}
          }
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./media-service/ \
                    --verbosity debug \
                    --destination rairtechinc/media-service:${GIT_COMMIT}
                '''
              }

            }
          }
        }
    stage('Build and push media-service new infra') {
          when {
            not { branch 'dev'}
          }
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile.prod \
                    --context ./media-service/ \
                    --verbosity debug \
                    --destination rairtechinc/media-service-new-infra:${GIT_COMMIT}
                '''
              }

            }
          }
        }
    stage('Build and push dev minting-marketplace') {
          when { branch 'dev'}
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile.prod \
                    --context ./minting-marketplace/ \
                    --verbosity debug \
                    --cleanup \
                    --destination rairtechinc/minting-network:${GIT_COMMIT} \
                    --destination rairtechinc/minting-network:${GIT_BRANCH}_2.${BUILD_ID}
                '''
              }

            }
          }
        }
    //stage('Build and push dev minting-marketplace new-infra') {
    //      when { branch 'dev'}
    //      steps {
    //        container(name: 'kaniko', shell: '/busybox/sh') {
    //          withEnv(['PATH+EXTRA=/busybox']) {
    //            sh '''#!/busybox/sh -xe
    //              /kaniko/executor \
    //                --dockerfile Dockerfile.prod-new \
    //                --context ./minting-marketplace/ \
    //                --verbosity debug \
    //                --cleanup \
    //                --destination rairtechinc/minting-network:${GIT_COMMIT} \
    //                --destination rairtechinc/minting-network:${GIT_BRANCH}_2.${BUILD_ID}
    //            '''
    //          }

    //        }
    //      }
    //    }
    stage('Build and push dev rairnode') {
          when { branch 'dev'}
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./rairnode/ \
                    --verbosity debug \
                    --cleanup \
                    --destination rairtechinc/rairservernode:${GIT_COMMIT} \
                    --destination rairtechinc/rairservernode:${GIT_BRANCH}_2.${BUILD_ID}
                '''
              }

            }
          }
        }
    stage('Build and push dev event-listener') {
          when { branch 'dev'}
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile.prod \
                    --context ./blockchain-networks-service/ \
                    --verbosity debug \
                    --cleanup \
                    --destination rairtechinc/blockchain-event-listener:${GIT_COMMIT} \
                    --destination rairtechinc/blockchain-event-listener:${GIT_BRANCH}_2.${BUILD_ID}
                '''
              }

            }
          }
        }
    stage('Build and push dev media-service') {
          when { branch 'dev'}
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./media-service/ \
                    --verbosity debug \
                    --destination rairtechinc/media-service:${GIT_COMMIT} \
                    --destination rairtechinc/media-service:${GIT_BRANCH}_2.${BUILD_ID}

                '''
              }
            }
            }
          }
    stage('Build and push dev media-service new infra') {
          when { branch 'dev'}
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile.prod \
                    --context ./media-service/ \
                    --verbosity debug \
                    --destination rairtechinc/media-service-new-infra:${GIT_COMMIT} \
                    --destination rairtechinc/media-service-new-infra:${GIT_BRANCH}_2.${BUILD_ID}

                '''
              }

            }
          }
        }
    stage('Jenkins Slack Notification') {
      steps {
                slackSend channel: '#jenkins-builds',
                          message: 'Branch ' + GIT_BRANCH + ' with build-id ' + GIT_COMMIT + ' has successfully built and pushed to docker ' + BUILD_URL
      }
    }
  //   stage('Deploy configmap to dev k8s environment'){
  //     when { branch 'dev' }
  //     steps {
  //       container('kubectl') {
  //       step([$class: 'KubernetesEngineBuilder',
  //       namespace: "default",
  //       projectId: env.DEV_PROJECT_ID,
  //       clusterName: env.DEV_CLUSTER,
  //       zone: env.DEV_LOCATION,
  //       manifestPattern: 'kubernetes-manifests/configmaps/environment/tf',
  //       credentialsId: env.CREDENTIALS_ID])
  //   }
  //     }
  //   }
  //   stage('Deploy k8s'){
  //     when { branch 'dev' }
  //     steps {
  //       container('kubectl') {
  //       sh("sed -i.bak 's#dev_latest#${GIT_COMMIT}#' ${env.WORKSPACE}/kubernetes-manifests/tf-manifest/*.yaml")
  //       step([$class: 'KubernetesEngineBuilder',
  //       namespace: "default",
  //       projectId: env.DEV_PROJECT_ID,
  //       clusterName: env.DEV_CLUSTER,
  //       zone: env.DEV_LOCATION,
  //       manifestPattern: 'kubernetes-manifests/tf-manifest',
  //       credentialsId: env.CREDENTIALS_ID,
  //       verifyDeployments: true])
  //   }
  //     }
  //   }
  //   stage('Deploy configmap to staging k8s environment'){
  //     when { branch 'main' }
  //     steps {
  //       container('kubectl') {
  //       step([$class: 'KubernetesEngineBuilder',
  //       namespace: "default",
  //       projectId: env.MAIN_PROJECT_ID,
  //       clusterName: env.MAIN_CLUSTER,
  //       zone: env.MAIN_LOCATION,
  //       manifestPattern: 'kubernetes-manifests/configmaps/environment/staging',
  //       credentialsId: env.CREDENTIALS_ID])
  //   }
  //     }
  //   }
  //   stage('Deploy to k8s staging'){
  //     when { branch 'main' }
  //     steps {
  //       sh("sed -i.bak 's#latest#${GIT_COMMIT}#' ${env.WORKSPACE}/kubernetes-manifests/staging-manifest/*.yaml")
  //       step([$class: 'KubernetesEngineBuilder',
  //       namespace: "default",
  //       projectId: env.MAIN_PROJECT_ID,
  //       clusterName: env.MAIN_CLUSTER, zone:
  //       env.MAIN_LOCATION,
  //       manifestPattern: 'kubernetes-manifests/staging-manifest',
  //       credentialsId: env.CREDENTIALS_ID,
  //       verifyDeployments: true])
  //   }
  // }

}
}