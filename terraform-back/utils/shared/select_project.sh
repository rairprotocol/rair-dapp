#!/bin/bash

DIR=$(dirname "$0")

if [ -z "$1" ]; then
  # nothing passed in as arg, use selector below instead
  # init project ID to emptry string
  PROJECT_ID=""
else
  echo "Project ID was passed in, use it instead"
  echo $1 > $CURRENTLY_SELECTED_PROJECT_ID_TEMP_FILE
  exit 0
fi

echo "========================"
echo "Select project ID \n"

DEV_PROJECT_ID="rair-market-dev"
STAGING_PROJECT_ID="rair-market-staging"
PROD_PROJECT_ID="rair-market-production"

echo "1.) DEV:         $DEV_PROJECT_ID"
echo "2.) STAGING:     $STAGING_PROJECT_ID"
echo "3.) PRODUCTION:  $PROD_PROJECT_ID"

echo "Select using the listed numbers (1, 2, 3, etc..): "
read USER_SELECTION

case $USER_SELECTION in
  1)
    printf "Selecting $DEV_PROJECT_ID\n"
    SELECTED_PROJECT_ID=$DEV_PROJECT_ID
    ;;
  2)
    printf "Selecting $STAGING_PROJECT_ID\n"
    SELECTED_PROJECT_ID=$STAGING_PROJECT_ID
    ;;
  3)
    printf "Selecting $PROD_PROJECT_ID\n"
    SELECTED_PROJECT_ID=$PROD_PROJECT_ID
    ;;
  *)
    echo "ERROR"
    exit 1
    ;;
esac

printf "\nAre you sure you want to continue this action on:\n$SELECTED_PROJECT_ID: \n(y/n) "

read CONFIRM_INPUT

case $CONFIRM_INPUT in
  y)
    printf "Taking action on $SELECTED_PROJECT_ID\n"
    ;;
  *)
    echo "Nevermind"
    exit 1
    ;;
esac

