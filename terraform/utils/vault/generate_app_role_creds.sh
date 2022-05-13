
DIR=$(dirname "$0")

source $DIR/before_script.sh

# divider that will be reused across script
DIVIDER="--------------------------------"

echo $DIVIDER

APP_ROLE_PREFIX="auth/approle/role/"
APP_ROLE_NAME=""


PS3='Select application: '
options=("rairnode" "blockchain-network")
select opt in "${options[@]}"
do
    case $opt in
        "rairnode")
            APP_ROLE_NAME="rairnode"
            break;
            ;;
        "blockchain-network")
            APP_ROLE_NAME="blockchain-network"
            break;
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

APP_ROLE_FORMATTED="$APP_ROLE_PREFIX$APP_ROLE_NAME"

OUTPUT_FILE="$DIR/credential_output/$APP_ROLE_NAME.credential_output.txt"

echo $DIVIDER
echo "Generating credentials..."

clear_init_output () {
  echo "" > $OUTPUT_FILE
}

print_to_output () {
  echo $@ >> $OUTPUT_FILE
}

# clear file if it already exists
clear_init_output

print_to_output $DIVIDER
print_to_output "Credentials for Vault app role: $APP_ROLE_FORMATTED"
echo "Credentials for Vault app role: $APP_ROLE_FORMATTED"
print_to_output $DIVIDER
print_to_output "Vault cluster url: $VAULT_ADDR"


ROLE_ID=$(vault read $APP_ROLE_FORMATTED/role-id | jq .data.role_id --raw-output)
print_to_output $DIVIDER
print_to_output "Role ID:"
print_to_output "$ROLE_ID"

SECRET_ID=$(vault write -f $APP_ROLE_FORMATTED/secret-id | jq .data.secret_id --raw-output)
print_to_output $DIVIDER
print_to_output "Secret ID:"
print_to_output "$SECRET_ID"

print_to_output $DIVIDER
source $DIR/credential_wiper.sh
print_to_output $DIVIDER
echo "Output file removed."

print_to_output $DIVIDER
source $DIR/unset.sh
echo "Complete."
echo $DIVIDER