#!/usr/bin/env bash

# this script contains all the commands needed to build and run a local image that 
# behaves similar to the image used by Bitbucket Pipelines. 

Dockerfile="./commands/bitbucket-pipelines/pipeline-docker-build/Dockerfile"
cd ../../../ #Puts us into rair repository root for setup

imageToPull="atlassian/default-image:3"
imageName="bitbucket_pipeline"

output "*" "Pulling $imageToPull"
docker pull $imageToPull
output "*" "Image Pull Successful"

# This command will build our Bitbucket Pipeline image. Of special note is the memory arguments
# which should correspond with the memory requested in our bitbucket-pipelines.yml file. The default is 1g.
output "*" "Building $imageToPull"
docker build --memory=3g --memory-swap=3g -t $imageName -f $Dockerfile .
output "*" "Built $imageToPull . Renamed to $imageName"

# BITBUCKET_CLONE_DIR is an environment variable used by Bitbucket Pipelines to reference
# the root directory of the repository being used. I use it frequently in pipeline scripts
# so I have passed it here as an argument for ease of use. If we end up needing more of the
# Bitbucket variables we can alternatively pass a .env file containing more
output "*" "Running $imageName"
docker run -it -e BITBUCKET_CLONE_DIR=/rair -v /var/run/docker.sock:/var/run/docker.sock \
--memory=4g --memory-swap=4g --memory-swappiness=0 --cpus=4 $imageName