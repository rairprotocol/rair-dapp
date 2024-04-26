#check readme file for errors before uploading. 

#Path to API definition, realative to this script
PATHTOFILE=$1

DIVIDER="-----------------------------------------------"

#Script path
DIR=$(dirname $0)

#Validate
printf "\n%s\n" "[#] Running validate_readme.sh" $DIVIDER
npx rdme validate $PATHTOFILE
RES=$?
echo $DIVIDER

#Exit Condition 0=VALID 1=INVALID
if [ $RES -eq 0 ]; then printf "\n%s\n\n" "[$] VALID - No Errors Found. Updating API..." ; exit 0; fi
printf "\n%s\n\n" "[!] INVALID - Check API definition file for errors."
exit 1