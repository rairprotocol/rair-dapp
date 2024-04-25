# KUBERNETES DEPLOYMENT

CREATE CLUSTER OR SELECT CLUSTER
# (Use dev cluster)

CREATE NAMESPACE
# kubectl create namespace $NAME

CREATE DEDICATED IP ADDRESS
# gcloud compute addresses create $IP --global

CREATE FOLDER FOR DEPLOYMENT

ADJUST VARIABLES
(Create google analytics account etc)

CREATE / ADJUST SECRET.YAML
# ./configmaps/environment/secrets - contact Devops or find secrets.yaml in 1password

SET DEFAULT NAMESPACE FOR SAFETY
# kubectl config set-context --current --namespace=<insert-namespace-name-here>

-------------------------------------------

## MAKE SURE YOU ARE ON THE CORRECT CLUSTER AND ENVIRONMENT BEFORE APPLYING COMMANDS BELOW ##

-------------------------------------------

APPLY CONFIGMAP
# kubectl apply -f . in ./configmaps/environment/$environment

APPLY SECRETS
# kubectl apply -f secrets.yaml

APPLY MAIN MANIFESTS

# kubectl apply -f ./dev-manifest/. 

UPDATE DNS IN CLOUDFLARE VIA TF WITH NEW IP ADDRESSES

# If relevent