const contractDefinition = artifacts.require('./PEPE.sol')

contract('PEPE', accounts => {
  var contractInstance
  var owner = accounts[0]

  beforeEach(async function() { 
    contractInstance = await contractDefinition.new({from: owner})
  })

  describe('mints', () => {
    it('works when user mints', async function () { 
      let tx = await contractInstance.mint('ipfsHash', web3.toWei(.001, "ether"), {from: owner})

      let tokenId = tx.logs[0].args._tokenId
      assert.equal(await contractInstance.ownerOf(tokenId), contractInstance.address)
    })
  })

  describe('getIPFSHash', () => {
    it('gets ipfsHash', async function () { 
      let tx = await contractInstance.mint('ipfsHash', web3.toWei(.001, "ether"), {from: owner})
      let tokenId = tx.logs[0].args._tokenId

      assert.equal('ipfsHash', await contractInstance.getIpfsHash(tokenId))
    })
  })

  describe('buyRAIR', () => { 
    it('buys RAIR', async function () {
      let tx = await contractInstance.mint('ipfsHash', web3.toWei(.001, "ether"), {from: owner})
      let tokenId = tx.logs[0].args._tokenId
        
      let tx2 = await contractInstance.buyRAIR(tokenId, {from: accounts[1], value: web3.toWei(.001, "ether")})

      assert.equal(accounts[1], await contractInstance.ownerOf(tokenId))
    })
  })

  describe('tokensOf', () => {
    it('can get tokens of', async function () { 
      await contractInstance.mint('ipfsHash', web3.toWei(.001, "ether"), {from: owner})
      await contractInstance.mint('ipfsHash2', web3.toWei(.001, "ether"), {from: owner})
      await contractInstance.mint('ipfsHash3', web3.toWei(.001, "ether"), {from: owner})
  
      let tokens = await contractInstance.tokensOf(contractInstance.address)
      assert.equal(tokens.length, 3)
    })
  })
})
