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
            echo env.GIT_COMMIT
            echo env.BRANCH_NAME
            container(name: 'kaniko', shell: '/busybox/sh') {
              withEnv(['PATH+EXTRA=/busybox']) {
                sh '''#!/busybox/sh -xe
                  /kaniko/executor \
                    --dockerfile Dockerfile \
                    --context ./rairnode/ \
                    --verbosity debug 
                    --destination rairtechinc/rairservernode:$BUILD_ID
                '''
              }

            }
          }
        }
   
  }
}
