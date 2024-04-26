# Get all NFTs from a user

**URL** : `/api/nft/network/:network/:contractAddress/:product/token/:token`
**Method** : `GET`

**Parameters**
```json
{
    "network": { "required": true, "content": { "type": "string" } },
    "contractAddress": { "required": true, "content": { "type": "string" } },
    "product": { "required": true, "content": { "type": "string" } },
    "token": { "required": true, "content": { "type": "string" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "result": {
        "_id": "64ff477957d24b6bb5e72bb1",
        "token": "1",
        "uniqueIndexInContract": "1",
        "ownerAddress": "0x0000000000000000000000000000000000000000",
        "offer": "0",
        "contract": "64ff440357d24b6bb5e672da",
        "metadataURI": "none",
        "authenticityLink": "none",
        "isMinted": false,
        "isURIStoredToBlockchain": false,
        "metadata": {
            "image": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "artist": "none",
            "external_url": "none",
            "description": "none",
            "name": "none",
            "attributes": []
        },
        "creationDate": "2023-09-11T16:59:37.876Z"
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