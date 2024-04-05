# Returns the current user's contracts
If the user is super admin it returns all contracts

**URL** : `/api/contracts/factoryList`
**Method** : `GET`

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "contracts": [
        {
            "_id": "64ff3f5757d24b6bb5e45009",
            "title": "suresh-Matic_2403",
            "blockchain": "0x13881",
            "contractAddress": "0xfd9ea47ae7dad66f4343d5fe518757dbc1dd7460",
            "diamond": false
        },
        {
            "_id": "64ff3f5757d24b6bb5e4500c",
            "title": "suresh-Matic_1204",
            "blockchain": "0x13881",
            "contractAddress": "0xb479b76a4356e290379bb0610d196b4cd6ab8458",
            "diamond": false
        },
        {
            "_id": "64ff3f5757d24b6bb5e4500f",
            "title": "suresh-Matic_1204_2",
            "blockchain": "0x13881",
            "contractAddress": "0xe91d0329a13944cbf7c2342d7805cd9a93bf0e51",
            "diamond": false
        },
    ]
}
```