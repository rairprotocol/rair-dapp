import { useState } from 'react';

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
                  item={contractData}
                  className="nft-item-collection grid-item"
                  key={index}
                  index={index}
                  playing={playing}
                  setPlaying={setPlaying}
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
