
DIR=$(dirname "$0")

echo "Generate short lived token for vault kv test"

source $DIR/before_script.sh

APP_ROLE="auth/approle/role/test-role"

ROLE_ID=$(vault read $APP_ROLE/role-id | jq .data.role_id --raw-output)
echo $ROLE_ID

SECRET_ID=$(vault write -f $APP_ROLE/secret-id | jq .data.secret_id --raw-output)
echo $SECRET_ID

LOGIN_RES=$(vault write "auth/approle/login" role_id=$ROLE_ID secret_id=$SECRET_ID)
echo $LOGIN_RES

LOGIN_CLIENT_TOKEN=$(echo $LOGIN_RES | jq .auth.client_token --raw-output)
echo $LOGIN_CLIENT_TOKEN

export VAULT_TOKEN=$LOGIN_CLIENT_TOKEN
vault token renew -output-curl-string

source $DIR/unset.sh