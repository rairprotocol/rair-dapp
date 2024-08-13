PUBLIC_ADDRESS = "VAR_PUBLIC_ADDRESS"
ADMIN_NFT = "VAR_ADMIN_NFT"


//Sets default admin credentials to allow access to rair-db
db = db.getSiblingDB('admin')
db.auth("admin","admin")
db = db.getSiblingDB('rair-db')

//Set Blockchain RPC Url
db.Blockchain.insertOne({
   "hash": "0x2105",
   "name": "Base",
   "display": "true",
   "sync": "true",
   "alchemySupport": "false",
   "blockExplorerGateway": "https://basescan.org",
   "mainTokenAddress": "0x2b0fFbF00388f9078d5512256c43B983BB805eF8",
   "diamondFactoryAddress": "0x1F89Cc515dDc53dA2fac5B0Ca3b322066A71E6BA",
   "diamondMarketplaceAddress": "0x58795f50b50d492C4252B9BBF78485EF4043FF3E",
   "numericalId": "8453",
   "rpcEndpoint": "https://base.meowrpc.com/",
   "symbol": "bETH"
})


//Set SuperAdmin
db.ServerSetting.updateMany({},
    { $push: { "superAdmins" : PUBLIC_ADDRESS } }
)

print("\nExiting Mongo Shell...")
db.logout()
quit()
