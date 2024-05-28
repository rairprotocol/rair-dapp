# Get all server settings

**URL** : `/api/settings/`
**Method** : `POST`

**Body Parameters**
```json
{
    "onlyMintedTokensResult": { "required": false, "content": { "type": "boolean" } },
    "demoUploadsEnabled": { "required": false, "content": { "type": "boolean" } },
    "featuredCollection": { "required": false, "content": { "type": "string" } },
    "nodeAddress": { "required": false, "content": { "type": "string" } },
    "superAdmins": { "required": false, "content": { "type": "string[]" } },
    "darkModePrimary": { "required": false, "content": { "type": "string" } },
    "darkModeSecondary": { "required": false, "content": { "type": "string" } },
    "darkModeText": { "required": false, "content": { "type": "string" } },
    "buttonPrimaryColor": { "required": false, "content": { "type": "string" } },
    "buttonFadeColor": { "required": false, "content": { "type": "string" } },
    "buttonSecondaryColor": { "required": false, "content": { "type": "string" } },
    "superAdminsOnVault": { "required": false, "content": { "type": "boolean" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
}
```