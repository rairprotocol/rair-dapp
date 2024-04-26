# Associate an array of offers with a file
Returns the updated list of offers

**URL** : `/api/files/:id/unlocks`
**Method** : `DELETE`

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "offer": {
        "_id": "650470335ccb1fe20e5f3fde",
        "file": "QmfT8BAJnzhERPmxSSwoK7pfVjpEZdRP1X7VmFTpn6Qtk3",
        "offers": [
            "65414514a83090be43bccd85",
            "64ff61a80182f00249359f3b"
        ]
    }
}
```