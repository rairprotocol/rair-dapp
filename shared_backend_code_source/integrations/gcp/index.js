const { Storage } = require('@google-cloud/storage');

const getAuthorizedStorageObject = ({
  use_default_iam,
  storageParams,
  jsonCredentialsLocation
}) => {
  try {
    // Check in configmap for default IAM user setting
    if(!use_default_iam) {
      // extract credentials from json file
      const credentials = JSON.parse(jsonCredentialsLocation);

      // add credentials object to params
      storageParams = {
        ...storageParams,
        credentials,
      }
    }
    // else just rely on the default creds
    return new Storage(storageParams);
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getAuthorizedStorageObject
};
