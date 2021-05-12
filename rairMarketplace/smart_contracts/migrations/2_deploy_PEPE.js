var PEPE = artifacts.require("./PEPE.sol");

hashes = [ 
  "QmQiiRbegkBbL1PRRi9Fwim4gvPycFvSUffXmLisgBEWGU", 
  "QmWufdoaVM2gSVut3cKpBhLqVGzV941vSg5HL6i9r1YnGD", 
  "QmZmYwPUUZAaPpecVbrWfpaM7YZnx6YbiiAa7fJAQKxAp5", 
  "QmNojFX4YuM7A4hqH72EzhuFznU7XLRyarsv1MHmFQKaQo", 
  "QmbJQRAgDfJfWJkVRSamnY2uPbGEG83xj6N3iQ1F7pHqHC", 
  "QmbNiFDdGWkktvNn1dgPEjh9BE6Mw4Ut7SKwnGMMNW9Zdb", 
  "QmZ9peivr2kqQcN5dAavmqrQYEz9bSueakD4VTr7dFBR33", 
  "QmTqZTCGzsU1EmrLZr5a8Ve9ize8S7XDrQqWFKzU4rBtXt", 
  "QmUWXyY1NvaBZK9drbE5rKdeCuo4eSawAwJMpT6i7vsDP7", 
  "QmYTyvmMcoGbv2X6vRH7ESWRPd9pwDWJyghkjLmkiQSGi4"
]

module.exports = function(deployer) {
  deployer.deploy(PEPE).then(contract => { 
    hashes.forEach(function(hash) { 
      contract.mint(hash, web3.toWei(.001, "ether"))
    })
  })
};
