var PEPE = artifacts.require("./PEPE.sol");

hashes = [ 
  "QmPfuYMrQZZuy6uRM61hyH4pzygHeNuCsjwpbZsQCtLVws", 
  "QmPfuYMrQZZuy6uRM61hyH4pzygHeNuCsjwpbZsQCtLVws", 
  "QmPfuYMrQZZuy6uRM61hyH4pzygHeNuCsjwpbZsQCtLVws", 
  "QmPfuYMrQZZuy6uRM61hyH4pzygHeNuCsjwpbZsQCtLVws", 
  "QmPfuYMrQZZuy6uRM61hyH4pzygHeNuCsjwpbZsQCtLVws", 
  "QmPfuYMrQZZuy6uRM61hyH4pzygHeNuCsjwpbZsQCtLVws", 
  "QmPfuYMrQZZuy6uRM61hyH4pzygHeNuCsjwpbZsQCtLVws", 
  "QmPfuYMrQZZuy6uRM61hyH4pzygHeNuCsjwpbZsQCtLVws", 
  "QmPfuYMrQZZuy6uRM61hyH4pzygHeNuCsjwpbZsQCtLVws", 
  "QmPfuYMrQZZuy6uRM61hyH4pzygHeNuCsjwpbZsQCtLVws"
]

module.exports = function(deployer) {
  deployer.deploy(PEPE).then(contract => { 
    hashes.forEach(function(hash) { 
      contract.mint(hash, web3.toWei(.001, "ether"))
    })
  })
};
