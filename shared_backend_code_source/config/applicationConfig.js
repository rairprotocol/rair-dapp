const applicationConfig = {
  "rairnode": {
    name: "rairnode",
    useDefaultIamUserForFileManager: process.env.USE_DEFAULT_IAM_USER_FOR_FILE_MANAGEMENT,
  },
  "blockchain-network": {
    name: "blockchain-network"
  },
  "media-service": {
    name: "media-service"
  }
}

module.exports = applicationConfig;
