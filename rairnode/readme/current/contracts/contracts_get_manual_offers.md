# Get products with offers given a blockchain and address
Products without offers are excluded

**URL** : `/api/contracts/network/:networkId/:contractAddress/offers`
**Method** : `GET`

**Parameters:**
```json
{
    "networkId": { "type": "string", "required": true },
    "contractAddress": { "type": "string", "required": true },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "products": [
        {
            "_id": "64ff3f8057d24b6bb5e45219",
            "name": "Product-2_suresh-Matic_2403",
            "collectionIndexInContract": "2",
            "contract": "64ff3f5757d24b6bb5e45009",
            "copies": 100,
            "soldCopies": 0,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "601",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0x182c7b697d512e73f721d7ed030e654ee3e1a82763f5cbf22181bd6ba8ddb82b",
            "diamond": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "creationDate": "2023-09-11T16:25:36.759Z",
            "offerPool": {
                "_id": "64ff468357d24b6bb5e6f7f1",
                "marketplaceCatalogIndex": "26",
                "contract": "64ff3f5757d24b6bb5e45009",
                "product": "2",
                "rangeNumber": "1",
                "minterAddress": "0x4594D508cDa05D016571082d467889f4629e1f56",
                "transactionHash": "0x1e9dcf5d5de52d375f4b36470f18730af1082831eb94b0b0941331c2ed242dea",
                "creationDate": "2023-09-11T16:55:31.476Z"
            },
            "offers": [
                {
                    "_id": "64ff468357d24b6bb5e6f7ed",
                    "offerIndex": "0",
                    "contract": "64ff3f5757d24b6bb5e45009",
                    "product": "2",
                    "offerPool": "26",
                    "copies": 26,
                    "allowedCopies": 0,
                    "lockedCopies": 0,
                    "soldCopies": 5,
                    "sold": false,
                    "price": "1000",
                    "range": [
                        "0",
                        "25"
                    ],
                    "offerName": "offer-11042022_200014",
                    "diamond": false,
                    "transactionHash": "0x1e9dcf5d5de52d375f4b36470f18730af1082831eb94b0b0941331c2ed242dea",
                    "hidden": false,
                    "creationDate": "2023-09-11T16:55:31.475Z"
                }
            ]
        },
        {
            "_id": "64ff3f8057d24b6bb5e45214",
            "name": "product-01042022_142048",
            "collectionIndexInContract": "1",
            "contract": "64ff3f5757d24b6bb5e45009",
            "copies": 501,
            "soldCopies": 0,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "100",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0x943fea367553f9cbe8b41269fb6a0490f21fdf74e22610408a1015fa0fe88114",
            "diamond": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "creationDate": "2023-09-11T16:25:36.752Z",
            "offerPool": {
                "_id": "64ff468357d24b6bb5e6f7de",
                "marketplaceCatalogIndex": "24",
                "contract": "64ff3f5757d24b6bb5e45009",
                "product": "1",
                "rangeNumber": "1",
                "minterAddress": "0x4594D508cDa05D016571082d467889f4629e1f56",
                "transactionHash": "0x6484952f1b058697270137891e1d3ad79fe26628dfddb4a19fbf71165b04c3e0",
                "creationDate": "2023-09-11T16:55:31.468Z"
            },
            "offers": [
                {
                    "_id": "64ff468357d24b6bb5e6f7da",
                    "offerIndex": "0",
                    "contract": "64ff3f5757d24b6bb5e45009",
                    "product": "1",
                    "offerPool": "24",
                    "copies": 26,
                    "allowedCopies": 0,
                    "lockedCopies": 0,
                    "soldCopies": 6,
                    "sold": false,
                    "price": "1000",
                    "range": [
                        "0",
                        "25"
                    ],
                    "offerName": "offer-01042022_172415",
                    "diamond": false,
                    "transactionHash": "0x6484952f1b058697270137891e1d3ad79fe26628dfddb4a19fbf71165b04c3e0",
                    "hidden": false,
                    "creationDate": "2023-09-11T16:55:31.467Z"
                },
                {
                    "_id": "64ff468357d24b6bb5e6f7e3",
                    "offerIndex": "1",
                    "contract": "64ff3f5757d24b6bb5e45009",
                    "product": "1",
                    "offerPool": "24",
                    "copies": 7,
                    "allowedCopies": 0,
                    "lockedCopies": 0,
                    "soldCopies": 0,
                    "sold": false,
                    "price": "100000",
                    "range": [
                        "26",
                        "32"
                    ],
                    "offerName": "offer-01042022_180028",
                    "diamond": false,
                    "transactionHash": "0xff1e364aa32735071b1b6073f35b16681b7d6b2456fa0cc623e345b86277640c",
                    "hidden": false,
                    "creationDate": "2023-09-11T16:55:31.470Z"
                },
                {
                    "_id": "64ff468357d24b6bb5e6f806",
                    "offerIndex": "2",
                    "contract": "64ff3f5757d24b6bb5e45009",
                    "product": "1",
                    "offerPool": "24",
                    "copies": 3,
                    "allowedCopies": 0,
                    "lockedCopies": 0,
                    "soldCopies": 0,
                    "sold": false,
                    "price": "1000",
                    "range": [
                        "33",
                        "35"
                    ],
                    "offerName": "offer-3",
                    "diamond": false,
                    "transactionHash": "0x4a64ffdfcc4b129856fa2c9989838eeb43929f6cb0206895792751929f299246",
                    "hidden": false,
                    "creationDate": "2023-09-11T16:55:31.484Z"
                }
            ]
        },
        {
            "_id": "64ff3f7757d24b6bb5e451d6",
            "name": "product-1_suresh-Matic_2403",
            "collectionIndexInContract": "0",
            "contract": "64ff3f5757d24b6bb5e45009",
            "copies": 100,
            "soldCopies": 0,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "0",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0xd56d31b4a7d278d7d18ab3f8b00e28f3e19f484afeb2f7fe4e027bda3b797b8f",
            "diamond": false,
            "singleMetadata": false,
            "metadataURI": "https://rair.mypinata.cloud/ipfs/QmcKFLdZHvEnKmqTt6iFWothZQDvq7VZDgYeJ4Jqt79Jsm",
            "creationDate": "2023-09-11T16:25:27.265Z",
            "offerPool": {
                "_id": "64ff468357d24b6bb5e6f7a5",
                "marketplaceCatalogIndex": "23",
                "contract": "64ff3f5757d24b6bb5e45009",
                "product": "0",
                "rangeNumber": "1",
                "minterAddress": "0x4594D508cDa05D016571082d467889f4629e1f56",
                "transactionHash": "0x8e411d76b440b37676c66336be0959672f95ddb091ec2192ad60e24c872f0fc0",
                "creationDate": "2023-09-11T16:55:31.432Z"
            },
            "offers": [
                {
                    "_id": "64ff468357d24b6bb5e6f7a1",
                    "offerIndex": "0",
                    "contract": "64ff3f5757d24b6bb5e45009",
                    "product": "0",
                    "offerPool": "23",
                    "copies": 10,
                    "allowedCopies": 0,
                    "lockedCopies": 0,
                    "soldCopies": 8,
                    "sold": false,
                    "price": "10000",
                    "range": [
                        "0",
                        "9"
                    ],
                    "offerName": "offer-1",
                    "diamond": false,
                    "transactionHash": "0x8e411d76b440b37676c66336be0959672f95ddb091ec2192ad60e24c872f0fc0",
                    "hidden": false,
                    "creationDate": "2023-09-11T16:55:31.430Z"
                }
            ]
        }
    ]
}
```

**Condition** : Contract not found
**Code** : `404 NOT FOUND`
**Content** : 
```json
{ "success": false, "error": true, "message": "Contract not found" }
```