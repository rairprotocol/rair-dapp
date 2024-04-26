const axios = require('axios');
const {
    S3Client,
    PutObjectCommand,
} = require('@aws-sdk/client-s3');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const log = require('../../utils/logger')(module);

const bucketName = process.env.FILEBASE_BUCKET;
const s3Client = new S3Client({
    endpoint: 'https://s3.filebase.com',
    signatureVersion: 'v4',
    region: 'us-east-1',
});
s3Client.middlewareStack.add(
    (next) => async (args) => {
        const response = await next(args);
        if (!response.response.statusCode) return response;
        // Get cid from headers
        const cid = response.response.headers['x-amz-meta-cid'];
        response.output.cid = cid;
        return response;
    },
    {
        step: 'build',
        name: 'addCidToOutput',
    },
);

const s3Upload = async (name, data, folder = false) => {
    const input = {
        Bucket: bucketName,
        Key: name,
        Body: data,
    };
    if (folder) {
        input.Metadata = { import: 'car' };
    }
    const command = new PutObjectCommand(input);
    const result = await s3Client.send(command);
    return result;
};

module.exports = {
    retrieveMediaInfo: async (CID) => {
        const response = await axios.get(`https://ipfs.filebase.io/ipfs/${CID}/rair.json`);
        return response.data;
    },
    addPin: async (CID) => {
        try {
            const response = await axios.post('https://api.filebase.io/v1/ipfs/pins', {
                cid: CID,
            });
            log.info(`Filebase pinned to IPFS: ${JSON.stringify(response.data)}`);
        } catch (err) {
            log.error(`Error pinning to IPFS from Filebase: ${err.message}`);
        }
        return undefined;
    },
    removePin: async (CID) => {
        try {
            const response = await axios.post(`https://api.filebase.io/v1/ipfs/pins/${CID}`);
            log.info(`Unpin IPFS: ${response.data.Pins}`);
            return {
                success: true,
                mediaId: CID,
                response: response.data,
            };
        } catch (err) {
            log.error(`Could not remove pin from IPFS ${CID}: ${err}`);
            return {
                success: false,
                mediaId: CID,
                response: err,
            };
        }
    },
    addFolder: async (pathTo, folderName) => {
        try {
            const outputRoute = path.join(pathTo, '/', 'output.car');
            execSync(`npx ipfs-car pack ${pathTo} --output ${outputRoute}`);
            const fileContent = fs.readFileSync(outputRoute);
            const { cid } = await s3Upload(folderName, fileContent, true);
            return cid;
        } catch (error) {
            log.error(error);
        }
        return undefined;
    },
    addMetadata: async (data, name) => {
        try {
            const buffer = Buffer.from(JSON.stringify(data));
            const { cid } = await s3Upload(name, buffer);
            return cid;
        } catch (error) {
            log.error(error);
            log.error("Can't store metadata in Filebase.");
        }
        return undefined;
    },
    addFile: async (pathTo, name) => {
        try {
            const fileContent = fs.readFileSync(path.join(pathTo, '/', name));
            const { cid } = await s3Upload(name, fileContent);
            return cid;
        } catch (error) {
            log.error(error);
            log.error("Can't store file in Filebase.");
        }
        return undefined;
    },
};
