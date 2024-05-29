# List all categories

**URL** : `/api/files/categories`
**Method** : `GET`

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "categories": [
        {
            "_id": "64d2a36cc6657f2b26bc5c95",
            "name": "Music"
        },
        {
            "_id": "64d2a36cc6657f2b26bc5c9b",
            "name": "Art"
        },
        {
            "_id": "64d2a36cc6657f2b26bc5c9f",
            "name": "Conference"
        },
        {
            "_id": "64d2a36cc6657f2b26bc5ca2",
            "name": "Science"
        }
    ]
}
```