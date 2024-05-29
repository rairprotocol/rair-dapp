import React, { useState } from 'react';

import { NftItem } from './../../MockUpPage/NftList/NftItem';

const UserProfileCreated = ({ contractData, titleSearch }) => {
  const [playing, setPlaying] = useState<null | number>(null);

  const filteredContracts =
    contractData &&
    contractData.filter((el) =>
      el.name.toLowerCase().includes(titleSearch.toLowerCase())
    );

  return (
    <div className="gen">
      <div className={`list-button-wrapper-grid-template`}>
        {filteredContracts.length > 0 ? (
          filteredContracts.map((contractData, index) => {
            if (contractData.cover !== 'none') {
              return (
                <NftItem
                  className="nft-item-collection grid-item"
                  key={index}
                  pict={
                    contractData.cover
                      ? contractData.cover
                      : `${
                          import.meta.env.VITE_IPFS_GATEWAY
                        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`
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
