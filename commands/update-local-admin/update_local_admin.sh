#!/usr/bin/env bash

# update_local_admin.sh
# Written by Zeph
# April 2022

#########
# Setup #
#########

set -e

PUBLIC_ADDRESS=null
ADMIN_NFT=null


printf '\n|%s %s %s|\n' \
    "#######################" ' update_local_admin.sh ' "#######################"

#Get Public Address
printf '\n%s\n\n' \
\
"Enter developer public wallet address"

read INPUT  
[[ ${#INPUT} == 42 ]] && printf "\nAccepted - " || { printf "\nInvalid address. Exiting...\n\n"; exit; }
PUBLIC_ADDRESS=$(echo "$INPUT" | tr '[:upper:]' '[:lower:]')
printf "%s\n\n" "Setting Public Address to: $PUBLIC_ADDRESS"


#Get AdminNFT
printf '\n%s\n\n' \
\
"Enter developer adminNFT address"

read INPUT  
(( ${#INPUT} >= 42 )) && printf "\nAccepted - " || { printf "\nInvalid address. Exiting...\n\n"; exit; }
ADMIN_NFT=$(echo "$INPUT" | tr '[:upper:]' '[:lower:]')
printf "%s\n\n" "Setting AdminNFT to: $PUBLIC_ADDRESS"


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

#Creates files containing PUBLIC_ADDRESS and ADMIN_NFT in the mongo container
#This is to avoid creating a diff in the local copy of mongo_commands.js 
#when we substitite the values in the file. Especially in the off chance that
#the script fails before completion. This can be better handled in the future.
docker exec -it mongo sh -c "echo $PUBLIC_ADDRESS | cat > /tmp/PUBLIC_ADDRESS"
docker exec -it mongo sh -c "echo $ADMIN_NFT | cat > /tmp/ADMIN_NFT"

#######
#MONGO#
#######

#Copies the mongo_commands file into the Mongo Docker container at location
#/tmp/mongo_commands.js. This allows execution to continue after control
#has been handed over to the Mongo shell inside of the Mongo container. 
docker cp mongo_commands.js mongo:/tmp/mongo_commands.js

#Now we force the variable substitution inside the mongo container
docker exec -it mongo sh -c 'sed -i '' 's/VAR_PUBLIC_ADDRESS/'$(cat /tmp/PUBLIC_ADDRESS)'/g' /tmp/mongo_commands.js'
docker exec -it mongo sh -c 'sed -i '' 's/VAR_ADMIN_NFT/'$(cat /tmp/ADMIN_NFT)'/g' /tmp/mongo_commands.js'

#And Initialize the mongo shell with our script
printf "%s\n\n" "[!] Initializing Mongo Shell..."
docker exec -it mongo sh -c "mongo /tmp/mongo_commands.js"


#########
#CLEANUP#
#########

#Remove all generated files from Mongo container.

printf "\n[!] Cleaning up...\n"
docker exec mongo rm -rf /tmp/mongo_commands.js
docker exec mongo rm -rf /tmp/PUBLIC_ADDRESS
docker exec mongo rm -rf /tmp/ADMIN_NFT


printf "[!] Exiting script\n\n"
