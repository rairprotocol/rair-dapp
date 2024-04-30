#!/usr/bin/env bash

# dependency_sync_check - main.sh
# Written by Zeph
# May 2022

#######
#SETUP#
#######

# path to file being checked
INPUT=$1 

# Absolute path of the directory that the repository is cloned into within 
# the Docker container
RAIR=$BITBUCKET_CLONE_DIR

################
#COPY AND CHECK#
################

# Create a temporary copy of the $INPUT file's accompanying yarn.lock file 
# and place it in the current directory. Fail if none present.

LOCKFILE_OG=$RAIR/$INPUT"yarn.lock"
[ -a $LOCKFILE_OG ] || \
    { output "!" "NO CORRESPONDING YARN.LOCK FILE FOUND"; \
      output "!" "PLEASE GENERATE AND COMMIT ONE FOR $INPUT"package.json""; \
      exit 1; } 
$(cp $LOCKFILE_OG $DIR/yarn.lock) && LOCKFILE_COPY=$DIR/yarn.lock

# If successful, attempt to update yarn.lock copy and compare it with the original
echo " "
yarn --cwd $RAIR/$INPUT #Update original yarn.lock file
$(cmp -s -- $LOCKFILE_COPY $LOCKFILE_OG) || \
    { output "!" "Please sync $LOCKFILE_OG with package.json before committing."; \
      exit 1; }