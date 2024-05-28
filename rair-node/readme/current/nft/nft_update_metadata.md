# Update the metadata for a single NFT from a user

**URL** : `/api/nft/network/:network/:contractAddress/:product/token/:token`
**Method** : `POST`

**Parameters**
```json
{
    "network": { "required": true, "content": { "type": "string" } },
    "contractAddress": { "required": true, "content": { "type": "string" } },
    "product": { "required": true, "content": { "type": "string" } },
    "token": { "required": true, "content": { "type": "string" } },
}
```

**Body Parameters**
```json
{
    "name": { "required": true, "content": { "type": "string" } },
    "description": { "required": true, "content": { "type": "string" } },
    "artist": { "required": true, "content": { "type": "string" } },
    "external_url": { "required": true, "content": { "type": "string" } },
    "image": { "required": true, "content": { "type": "string" } },
    "animation_url": { "required": true, "content": { "type": "string" } },
    "attributes": { "required": true, "content": { 
        "trait_type": { "required": true, "content": { "type": "string" } },
        "value": { "required": true, "content": { "type": "string" } },
    } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "token": {
        "_id": "65414514a83090be43bccd8a",
        "token": "2",
        "uniqueIndexInContract": "2",
        "ownerAddress": "0x0000000000000000000000000000000000000000",
        "offer": "0",
        "contract": "6541442aa83090be43bccd74",
        "metadataURI": "none",
        "authenticityLink": "none",
        "isMinted": false,
        "isURIStoredToBlockchain": false,
        "metadata": {
            "image": "https://rair.mypinata.cloud/ipfs/QmVREBpQogHaC9Kv6woNtp36zXGysZsTu94nkktfE4eU8K/43.webp",
            "artist": "Chrissweet",
            "external_url": "https:///6541442aa83090be43bccd74/0/0/2",
            "description": "Unlock videos of the CoinAgenda Global conference with your NFT only @ coinagenda.rair.market. CoinAgenda speakers are professional investors, traders, digital currency funds, and top entrepreneurs in the blockchain and cryptocurrency sectors.",
            "name": "Coinagenda Global 2021 #2",
            "attributes": [
                {
                    "trait_type": "City",
                    "value": "grass"
                },
                {
                    "trait_type": "Dress",
                    "value": "grass"
                },
                {
                    "trait_type": "Ribbon",
                    "value": "indigo"
                },
                {
                    "trait_type": "Rocket",
                    "value": "red"
                },
                {
                    "trait_type": "Shoe",
                    "value": "red"
                },
                {
                    "trait_type": "Attendee",
                    "value": "TRUE"
                },
                {
                    "trait_type": "Speaker",
                    "value": "TRUE"
                },
                {
                    "trait_type": "Sponsor",
                    "value": "FALSE"
                },
                {
                    "trait_type": "Media",
                    "value": "FALSE"
                },
                {
                    "trait_type": "Original Owner",
                    "value": "Stephen"
                },
                {
                    "trait_type": "Processing Artist",
                    "value": "NitramDesign"
                },
                {
                    "trait_type": "Automation Artist",
                    "value": "Chondriotin"
                }
            ],
            "animation_url": ""
        },
        "creationDate": "2023-10-31T18:19:00.627Z",
        "isMetadataPinned": false
    }
}
```

**Condition** : Contract not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Contract not found" }
```
**Condition** : Offers not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Offers not found" }
```
**Condition** : Product not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Product not found" }
```
**Condition** : Offer Pool not found (old contracts only)
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Offer Pool not found" }
```
**Condition** : Token not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Token not found" }
```
**Condition** : User is not the creator of the contract or an admin
**Code** : `403 FORBIDDEN`
**Content** : 
```json
{ "success": false, "error": true, "message": "You have no permissions for updating token ${token}." }
```
**Condition** : Metadata sent is the same as the one in the database
**Code** : `400 BAD REQUEST`
**Content** : 
```json
{ "success": false, "error": true, "message": "Nothing to update." }
```