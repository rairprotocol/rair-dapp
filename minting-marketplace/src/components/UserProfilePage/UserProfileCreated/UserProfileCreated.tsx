import React, { useState } from 'react';

import { NftItem } from './../../MockUpPage/NftList/NftItem';

const UserProfileCreated = ({ contractData }) => {
  const [playing, setPlaying] = useState<null | number>(null);
  return (
    <div className="gen">
      <div className={`my-items-product-wrapper`}>
        {contractData && contractData.length > 0 ? (
          contractData.map((contractData, index) => {
            if (contractData.cover !== 'none') {
              return (
                <NftItem
                  className="col-2 my-item-element"
                  key={index}
                  pict={
                    contractData.cover
                      ? contractData.cover
                      : 'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW'
                  }
                  contractName={contractData.contract}
                  price={contractData.offerData.map((p) => String(p.price))}
                  blockchain={contractData.blockchain}
                  collectionName={contractData.name}
                  ownerCollectionUser={contractData.user}
                  index={index}
                  playing={playing}
                  setPlaying={setPlaying}
                  collectionIndexInContract={
                    contractData.collectionIndexInContract
                  }
                />
              );
            } else {
              return null;
            }
          })
        ) : (
          <div className="list-wrapper-empty">
            <h2>No items to display</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileCreated;
