
DIR=$(dirname "$0")

source $DIR/before_script.sh

# divider that will be reused across script
DIVIDER="--------------------------------"

# define App role that we're going to use here
APP_ROLE="auth/approle/role/rairnode"

OUTPUT_FILE=$DIR/credential_output/rairnode_app_role.credential_output.txt

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
print_to_output "Credentials for Vault app role: $APP_ROLE"
echo "Credentials for Vault app role: $APP_ROLE"
print_to_output $DIVIDER
print_to_output "Vault cluster url: $VAULT_ADDR"


ROLE_ID=$(vault read $APP_ROLE/role-id | jq .data.role_id --raw-output)
print_to_output $DIVIDER
print_to_output "Role ID:"
print_to_output "$ROLE_ID"

SECRET_ID=$(vault write -f $APP_ROLE/secret-id | jq .data.secret_id --raw-output)
print_to_output $DIVIDER
print_to_output "Secret ID:"
print_to_output "$SECRET_ID"

# Test that login works
LOGIN_RES=$(vault write "auth/approle/login" role_id=$ROLE_ID secret_id=$SECRET_ID)

print_to_output $DIVIDER
print_to_output "Testing that the login action worked with these credentials."
print_to_output "Login api call response output printed below:"
print_to_output $LOGIN_RES

# Extract token from sucessful login
LOGIN_CLIENT_TOKEN=$(echo $LOGIN_RES | jq .auth.client_token --raw-output)

export VAULT_TOKEN=$LOGIN_CLIENT_TOKEN

# Test that renew works
VAULT_TOKEN_RENEW_RES=$(vault token renew)

print_to_output $DIVIDER
print_to_output "Testing that the token renew action works"
print_to_output "Token renew api call response output printed below:"
print_to_output $VAULT_TOKEN_RENEW_RES

source $DIR/unset.sh

echo "Generating credentials complete."
echo "Check $OUTPUT_FILE for outupt"
echo $DIVIDER