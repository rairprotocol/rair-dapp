# Get all server settings

**URL** : `/api/settings/`
**Method** : `GET`

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "settings": {
        "_id": "64ca7d5f081d39ce7c808184",
        "onlyMintedTokensResult": false,
        "demoUploadsEnabled": true,
        "nodeAddress": "0x69e95EfB...",
        "featuredCollection": {
            "_id": "64ff488d57d24b6bb5e74947",
            "name": "Test#001",
            "collectionIndexInContract": "0",
            "contract": {
                "_id": "64ff440357d24b6bb5e67342",
                "title": "Test",
                "user": "0xec30759d0a3...",
                "blockchain": "0x5",
                "contractAddress": "0xe583e6efa8f7b2abe454e569595ba0f10aa90d53",
                "diamond": true,
                "transactionHash": "0x8a29c7ca0b268a6491bd01689bcf19fba30feaab652fea7e08a842405fc739b4",
                "lastSyncedBlock": "10544764",
                "external": false,
                "singleMetadata": false,
                "metadataURI": "none",
                "importedBy": "",
                "creationDate": "2023-09-11T16:44:51.303Z"
            },
            "copies": 200,
            "soldCopies": 30,
            "sold": false,
            "royalty": 0,
            "firstTokenIndex": "0",
            "cover": "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
            "transactionHash": "0x56d0b107e112cc4ee437b5415d1f756352e331e31cf47e5248757db4b87f901d",
            "diamond": true,
            "singleMetadata": false,
            "metadataURI": "ipfs://bafybeicukqazcaxz7l7quwfebjrinnwuvv5ihj6esftkf6owmx5nse5nye/",
            "creationDate": "2023-09-11T17:04:13.095Z",
            "bannerImage": "https://ipfs.io/ipfs/Qmdgud3qvpxqbTYkk4x71FUV4zvfUufu377GQeprqokof4"
        },
        "superAdmins": [
            "0xec30759d...",
            "0x43f2fe4b...",
            "0xd4f8e707..."
        ],
        "darkModeMobileLogo": "https://ipfs.io/ipfs/QmTAF5...",
        "lightModeBannerLogo": "https://ipfs.io/ipfs/QmX1wx...",
        "lightModeMobileLogo": "https://ipfs.io/ipfs/QmfJq1D...",
        "darkModePrimary": "#001b3d",
        "darkModeSecondary": "#98a8ae",
        "darkModeText": "#ffffff",
        "buttonPrimaryColor": "#4b54ce",
        "buttonFadeColor": "#74da72",
        "buttonSecondaryColor": "#1b4b42",
        "superAdminsOnVault": false,
        "darkModeBannerLogo": "https://rair.myfilebase.com/ipfs/QmNRwnvcbRWS..."
    },
    "blockchainSettings": [
        {
            "_id": "64d2a36cc6657f2b26bc5ca5",
            "hash": "0x38",
            "name": "Binance Mainnet",
            "sync": false,
            "display": false
        },
        {
            "_id": "64d2a36cc6657f2b26bc5ca7",
            "hash": "0x61",
            "name": "Binance Testnet",
            "sync": false,
            "display": false
        },
        {
            "_id": "64d2a36cc6657f2b26bc5ca9",
            "hash": "0x5",
            "name": "Goerli Testnet",
            "display": true,
            "sync": true
        },
        {
            "_id": "64d2a36cc6657f2b26bc5cab",
            "hash": "0x89",
            "name": "Matic Mainnet",
            "display": false,
            "sync": false
        },
        {
            "_id": "64d2a36cc6657f2b26bc5cad",
            "hash": "0x13881",
            "name": "Matic Mumbai Testnet",
            "display": true,
            "sync": true
        },
        {
            "_id": "64d2a36cc6657f2b26bc5caf",
            "hash": "0x1",
            "name": "Ethereum Mainnet",
            "display": false,
            "sync": false
        },
        {
            "_id": "64d2a36cc6657f2b26bc5cb1",
            "hash": "0x250",
            "name": "Astar Mainnet",
            "display": true,
            "sync": true
        }
    ]
}
```