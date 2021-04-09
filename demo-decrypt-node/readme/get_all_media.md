# Get all media

List all the registered media, their URIs and encrypted status

**URL** : `/api/media/list`

**Method** : `GET`

## Success Response

Returns a list of the currently registered media

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "QmNNV6U6eHPHGW8N9CTExcXxcEGM6iG7moNre4noV6Dwfz": {
    "key": {
      "type": "Buffer",
      "data": [
        157,
        96,
        21,
        102,
        160,
        152,
        134,
        255,
        61,
        60,
        183,
        219,
        113,
        128,
        112,
        102
      ]
    },
    "name": "Jellyfish",
    "author": "Unknown",
    "description": "Watch some jellyfish float around your screen",
    "mainManifest": "master.m3u8",
    "nftIdentifier": "0x495f947276749ce646f68ac8c248420045cb7b5e:46869648025395099948668125841353790881312978170515518835853961308381080715265",
    "encryption": "aes-128-cbc",
    "uri": "http://localhost:8080/ipfs/QmNNV6U6eHPHGW8N9CTExcXxcEGM6iG7moNre4noV6Dwfz"
  },
  ...
}
```
