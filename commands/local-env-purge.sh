#!/usr/bin/env bash

# local-env-purge.sh
# Written by Zeph
# March 2022

#########
# Setup #
#########

DIR=$(dirname $0) #File path of 'local-env-purge.sh' 
DB="rairnode/db/store.json" #File path or Rair Node database
DB_DATA="rairnode/dev/db-data" #File path of Rair Node DB data

#Confirmation before executing full script
printf '\n%s\n\n' \
\
"ATTENTION: This script will remove your local RAIR database, database data,
and will stop and remove all active docker containers and images." \
\
"Are you sure you want to continue? [y/N]?"

read INPUT  
case $INPUT in
    y|Y ) printf "\nStarting local environment purge...\n\n\n";;
    * ) exit;;
esac

#Log formatting function
function progress_log {
  printf '|%-36s %s|\n\n' "$1" "#######################"
}

##################
# Purge function #
##################
# Line 1 prints a status message. 
# line 2 attempts the run a command, If successful it prints a status message,
# otherwise any output printed to stderr is sent to /dev/null for annhilation.
# Line 4 prints an error message if the command from line 2 fails

function purge {
  progress_log "$1" 
  ($2 && printf "\n%s\n\n\n" "$3") 2> /dev/null
  x=$?
  if [ $x -ne 0 ]; then printf "\nATTENTION: $4\n\n\n"; fi
}

# Line 1 - Status message
# Line 2 - Command
# Line 3 - Successful status message
# Line 4 - Error message

purge "REMOVING RAIR DATABASE" \
  "rm $DIR/../$DB" \
  "[!]DATABASE REMOVED" \
  "NO DATABASE TO REMOVE" 
   
purge "DELETING RAIR DB DATA" \
  "rm -R $DIR/../$DB_DATA" \
  "[!]DB DATA DELETED" \
  "NO DATABASE DATA TO REMOVE"

purge "STOPPING DOCKER CONTAINERS" \
  "docker stop $(docker ps -aq)" \
  "[!]CONTAINERS STOPPED" \
  "NO DOCKER CONTAINERS TO STOP"

purge "REMOVING DOCKER IMAGES" \
  "docker rmi $(docker images -aq) -f" \
  "[!]IMAGES REMOVED" \
  "NO DOCKER IMAGES TO REMOVE"

purge "REMOVING UNUSED DATA" \
  "docker system prune -f" \
  "[!]UNUSED DATA PRUNED" \
  "NO EXTRA DATA TO REMOVE"

printf 'Script complete. Exiting...\n\n'