import React, { useState, useEffect, useCallback } from 'react';
import { rFetch } from '../../utils/rFetch';
import setDocumentTitle from '../../utils/setTitle';
import { BigNumber } from 'ethers';
import MinterMarketplaceItem from './MinterMarketplaceItem';
import { TOfferData } from './marketplace.types';

const MinterMarketplace = () => {
  const [offerData, setOfferData] = useState<TOfferData[]>([]);

  const fetchData = useCallback(async () => {
    const aux = await rFetch('/api/contracts/full');
    if (aux.success) {
      const offerArray: TOfferData[] = [];
      aux.contracts.forEach((contract) => {
        contract.products.offers.forEach((offer) => {
          for (const field of Object.keys(offer)) {
            if (offer[field]['$numberDecimal']) {
              offer[field] = BigNumber.from(
                offer[field]['$numberDecimal']
              ).toString();
            }
          }
          if (!offer.sold) {
            offerArray.push({
              blockchain: contract.blockchain,
              contractAddress: contract.contractAddress,
              productIndex: contract.products.collectionIndexInContract,
              productName: contract.products.name,
              totalCopies: contract.products.copies,
              minterAddress: contract?.offerPool?.minterAddress,
              ...offer
            });
          }
        });
      });
      setOfferData(offerArray);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setDocumentTitle('Minter Marketplace');
  }, []);

  return (
    <div className="row px-0 mx-0 w-100">
      {offerData.map((item, index) => {
        return <MinterMarketplaceItem item={item} index={index} key={index} />;
      })}
    </div>
  );
};

export default MinterMarketplace;
