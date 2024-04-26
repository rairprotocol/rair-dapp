# Get authentication challenge

**URL** : `/api/auth/get_challenge`
**Method** : `POST`

**Body parameters:**
```json
{
    "userAddress": { "required": true, "content": { "type": "string"} },
    "intent": { "required": true, "content": { "type": "string"} },
    "ownerAddress": { "required": false, "content": { "type": "string" }},
    "mediaId": { "required": false, "content": { "type": "string" }},
    "zoomId": { "required": false, "content": { "type": "string" }},
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "response": '{"types":{"EIP712Domain":[{"name":"name","type":"string"}],"Challenge":[{"name":"challenge","type":"string"},{"name":"description","type":"string"}]},"domain":{"name":"RAIR.tech"},"primaryType":"Challenge","message":{"description":"Login to RAIR. This sign request securely logs you in and will not trigger a blockchain transaction or cost any gas fees.","challenge":"022a4849f127d345fc0c9a239d8ff9f6312fc2ee79ac6486d5f78e8684bdc0e9"}}'
}
```

## Error Response
**Condition** : User tries to unlock an age restricted video
**Code** : `400 BAD REQUEST`
**Content** : 
```json
{ "success": false, "error": true, "message": "Age verification required" }
```
**Condition** : Invalid zoom meeting ID
**Code** : `400 BAD REQUEST`
**Content** : 
```json
{ "success": false, "error": true, "message": "Invalid meeting ID" }
```
**Condition** : No description or invalid ETH address
**Code** : `400 BAD REQUEST`
**Content** : 
```json
{ "success": false, "error": true, "message": "Error in signature description" }
```