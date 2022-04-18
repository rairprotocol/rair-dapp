#!/usr/bin/env bash

# update_local_admin.sh
# Written by Zeph
# April 2022

#########
# Setup #
#########

set -e

DIR=$(dirname $0)
PUBLIC_ADDRESS=null
ADMIN_NFT=null

printf '\n|%s %s %s|\n' \
    "#######################" ' update_local_admin.sh ' "#######################"

#The .env file is meant to hold individual adminNFT credentials locally
#so they dont have to be entered every time this script is run.
#It provides values to this script so they can be converted to lowercase 
#For database consumption, and then inserts them into mongo_commands.js
#before passing the file to the Mongo container. This should be easier,
#but vanilla js can not easily use node process.env. 

#Get Public Address
printf '\n%s\n\n' \
\
"Enter developer public wallet address"

read INPUT  
[[ ${#INPUT} == 42 ]] && printf "\nAccepted - " || { printf "\nInvalid address. Exiting...\n\n"; exit; }
PUBLIC_ADDRESS=$(echo "$INPUT" | tr '[:upper:]' '[:lower:]')
printf "%s\n\n" "Setting Public Address to: $PUBLIC_ADDRESS"
#Hacky. Pushes value to mongo_commands.js 
sed -i '' 's/VAR_PUBLIC_ADDRESS/'$PUBLIC_ADDRESS'/g' mongo_commands.js

#Get AdminNFT
printf '\n%s\n\n' \
\
"Enter developer adminNFT address"

read INPUT  
(( ${#INPUT} >= 42 )) && printf "\nAccepted - " || { printf "\nInvalid address. Exiting...\n\n"; exit; }
ADMIN_NFT=$(echo "$INPUT" | tr '[:upper:]' '[:lower:]')
printf "%s\n\n" "Setting AdminNFT to: $PUBLIC_ADDRESS"
#Hacky. Pushes value to mongo_commands.js 
sed -i '' 's/VAR_ADMIN_NFT/'$ADMIN_NFT'/g' mongo_commands.js

#Verification
printf "\n%s" "Public Address = $PUBLIC_ADDRESS"
printf "\n%s\n" "AdminNFT Address = $ADMIN_NFT"

printf '\n\n%s\n\n' \
\
"Is this information correct? [y/N]?"

read INPUT  
case $INPUT in
    y|Y ) printf "\n[!] Starting adminNFT update...\n";;
    * ) exit;;
esac


#######
#MONGO#
#######

#Copies the mongo_commands file into the Mongo Docker container at location
#/tmp/mongo_commands.js. This allows execution to continue after control
#has been handed over to the Mongo shell inside of the Mongo container. 

docker cp mongo_commands.js mongo:/tmp/mongo_commands.js
printf "%s\n\n" "[!] Initializing Mongo Shell..."
docker exec -it mongo sh -c 'cd tmp && mongo mongo_commands.js'


#########
#CLEANUP#
#########

#Remove mongo_commands.js from Mongo container, and set the variables back 
#to their original state. This is a hacky of returning the original file
#back to its original state so it doesnt create a diff after its run.
#Ideally this script would have access to a .env file, but I didnt have time
#to figure out how to implement it.

printf "\n[!] Cleaning up...\n"
docker exec mongo rm -rf /tmp/mongo_commands.js
sed -i '' 's/'$PUBLIC_ADDRESS'/VAR_PUBLIC_ADDRESS/g' mongo_commands.js
sed -i '' 's/'$ADMIN_NFT'/VAR_ADMIN_NFT/g' mongo_commands.js


printf "[!] Exiting script\n\n"
