const { serverURL, Contract_Address1, Contract_Id1, Product1_Contract1, Product1_Offer1_Contract1, Contract_Address2, Blockchain1  } = require('../test-util');
//import Api from '../src/common/Api';
import { ContractAPI } from '../../src/API/contracts';
//import { GetContractListParams } from '../../src/types/contracts';
//console.log(process.env.SERVER_URL)

const _contracts = new ContractAPI(serverURL, "contracts");

//_contracts.getProductsById({id: "667e5e30a26ca7419095b588"}).then(console.log);

jest.setTimeout(50000);
describe('E2E integration tests', () => {


   it('get contract list', async () => {
      const __contracts = await _contracts.getContractList({pageNum:1, itemsPerPage: 10});
      expect(__contracts.totalCount).toEqual(23); 
   });

   it.skip('Fetch an extended list of contracts', async () => {
      const __contracts = await _contracts.getFactoryList();
      expect(__contracts.contracts[0].contractAddress).toEqual(Contract_Address1); 
   });

   it.skip('List all contracts made by the current user', async () => {
      const __contracts = await _contracts.getMyContracts({userAddress: Contract_Address1});
      expect(__contracts.totalCount).toEqual(1); 
   });


   it('List contract data for the frontend catalog', async () => {
      const __contracts = await _contracts.getFullListOfContracts({});
      expect(__contracts.contracts[0].contractAddress).toEqual(Contract_Address2); 
   });

   it('Search for a contract using network and address', async () => {
      const __contracts = await _contracts.findContract({networkId: Blockchain1, contractAddress: Contract_Address1});
      expect(__contracts.contract.contractAddress).toEqual(Contract_Address1); 
   });

   it('Search for a contract using network and address, include products', async () => {
      const __contracts = await _contracts.findContractAndProducts({networkId: Blockchain1, contractAddress: Contract_Address1});
      expect(__contracts.products[0].collectionIndexInContract).toEqual('0'); 
   });

   it('Search for a contract using network and address, include offers', async () => {
      const __contracts = await _contracts.findContractAndOffers({networkId: Blockchain1, contractAddress: Contract_Address1});
      expect(__contracts.products[0].offers[0].offerName).toContain(Product1_Offer1_Contract1); 
   });

   it('Get a single contract by id', async () => {
     const __contracts = await _contracts.getById({id: Contract_Id1});
     expect(__contracts.contract.blockchain).toEqual(Blockchain1); 
   });

   it('Get a single contract by id, include product data', async () => {
     const __products = await _contracts.getProductsById({id: Contract_Id1});
     expect(__products.products[0].name).toEqual(Product1_Contract1); 
   });

   it.skip('Update information about a contract', async () => {
      const __contracts = await _contracts.updateContract({id: Contract_Id1, blockSync: false, blockView: false});
      expect(__contracts.data).toContain(Product1_Contract1); 
    });


});
