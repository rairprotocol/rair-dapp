#/bin/bash

set -e

DIR=$(dirname "$0")

# select project
source ./$DIR/../shared/select_project.sh
PROJECT_ID=$SELECTED_PROJECT_ID

gcloud auth login

echo $PROJECT_ID

gcloud config set project $PROJECT_ID

echo "Enter tailscale auth key:"
read -s TAILSCALE_AUTH_KEY_USER_INPUT

SECRET_NAME="tailscale-auth-key"

# create temp secret file
TEMP_SECRET_FILE="/tmp/tailscale_auth_key"
echo $TAILSCALE_AUTH_KEY_USER_INPUT > $TEMP_SECRET_FILE

gcloud secrets versions add $SECRET_NAME \
  --data-file=$TEMP_SECRET_FILE

# remove temp secret file when finished
rm $TEMP_SECRET_FILE