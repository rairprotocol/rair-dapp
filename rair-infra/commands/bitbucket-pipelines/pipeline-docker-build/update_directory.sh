#!/usr/bin/env bash

# update_directory.sh
# Written by Zeph
# June 2022

# Its a pain in the ass to have to build an image every time we make a change to the code
# we want to test. Caching will miss if any files have changed so this script will update 
# a directory and its contents inside our pipeline test container as a means of stepping
# around that limitation. 
# It is meant to be run from the host and will copy whatever files to whatever directory 
# in our container that we pass to the variables in this file. 

pipelineName="bitbucket_pipeline"
DIR=$(dirname $0) # Directory containing this script.
fileToPass="$DIR/../frontend-build-success-pipeline" # file we want to put into our container
fileToUpdate="./rair/commands/bitbucket-pipelines/." # file we want to copy $fileToPass into
containerID=$(docker ps -f ancestor=$pipelineName --format "{{.Names}}") 

docker cp $fileToPass $containerID:$fileToUpdate