# KUBERNETES DEPLOYMENT

CREATE CLUSTER OR SELECT CLUSTER

CREATE NAMESPACE
# kubectl create namespace $NAME

CREATE DEDICATED IP ADDRESS
# gcloud compute addresses create $IP --global

CREATE FOLDER FOR DEPLOYMENT

ADJUST VARIABLES
(Create google analytics account etc)

CREATE / ADJUST SECRET.YAML

SET DEFAULT NAMESPACE FOR SAFETY
# kubectl config set-context --current --namespace=<insert-namespace-name-here>

-------------------------------------------

## MAKE SURE YOU ARE ON THE CORRECT CLUSTER AND ENVIRONMENT BEFORE APPLYING COMMANDS BELOW ##

-------------------------------------------

APPLY CONFIGMAP

APPLY SECRETS

APPLY MAIN MANIFESTS

UPDATE DNS IN CLOUDFLARE VIA TF WITH NEW IP ADDRESSES