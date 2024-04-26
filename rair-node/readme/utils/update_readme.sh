# On commit of $PATHTOFILE, $VALIDATE the file first and upon success ($RES=0), 
# $UPDATE the api documentation on rairtech.readme.com. 
# Be sure to file a pull request when all updates are complete so the file stays consistent.

DIVIDER="-----------------------------------------------"

function updateAPI {

    #BITBUCKET_PIPELINE VARIABLES
    ID=$README_API_ID
    KEY=$README_PUBLIC_KEY

    npx rdme openapi $PATHTOFILE --key=$KEY --id=$ID
    RES=$?
    if [ $RES -eq 0 ]; then printf '\n%s\n\n' "[$] Update successful."; return 0; fi

    #OTHERWISE EXIT 1
    printf '\n%s\n\n' $DIVIDER "[!] Update failed"
    exit 1

}

printf '\n%s\n' $DIVIDER "[#] Initiaizing update_readme.sh..." 

#PATHS
DIR=$(dirname $0)
PATHTOFILE=$DIR/../openapi/rairapi_current.yaml
VALIDATE=$DIR/validate_readme.sh

printf '\n%s\n' "[#] Attempting to update RAIRtech README API definition..." 

#VALIDATE API DEFINITION
./$VALIDATE $PATHTOFILE
RES=$?
echo $DIVIDER

#If VALIDATION SUCCESS, RUN UPDATE SCRIPT
if [ $RES -eq 0 ]; then updateAPI; else exit 1; fi

#exit
if [ $? -eq 0 ]; then exit 0; fi
exit 1
