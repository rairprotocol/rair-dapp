import { useState } from 'react';

import { NftItem } from './../../MockUpPage/NftList/NftItem';

const UserProfileCreated = ({ contractData, titleSearch }) => {
  const [playing, setPlaying] = useState<null | number>(null);

  const filteredContracts =
    contractData &&
    contractData.filter(
      (el) =>
        el.product.name.toLowerCase().includes(titleSearch.toLowerCase()) &&
        el.product.cover !== 'none'
    );

  return (
    <div className="gen">
      <div className={`list-button-wrapper-grid-template`}>
        {filteredContracts.length > 0 ? (
          filteredContracts.map((item, index) => {
            return (
              <NftItem
                item={item}
                className="nft-item-collection grid-item"
                key={index}
                index={index}
                playing={playing}
                setPlaying={setPlaying}
              />
            );
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
