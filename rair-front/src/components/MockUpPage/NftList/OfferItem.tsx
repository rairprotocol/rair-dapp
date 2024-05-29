//@ts-nocheck
//unused-component
import React, { useState } from 'react';

import { IOfferItemComponent } from './nftList.types';

const OfferItem: React.FC<IOfferItemComponent> = ({
  handleClickToken,
  token,
  index,
  metadata,
  setSelectedToken,
  selectedToken
}) => {
  const [selectedItem, setSelectedItem] = useState(selectedToken);

  const select = () => {
    setSelectedToken(token);
    handleClickToken(token);
    setSelectedItem(token);
  };
  return (
    <button
      style={{
        border: 'none',
        background: 'none',
        marginTop: '1rem',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      key={index}
      onClick={() => {
        select(token);
        // handleClickToken(token)
        //  setSelected(metadata)}
      }}
      className={selectedToken === selectedItem ? 'activeClassToken' : ''}>
      {selectedToken === selectedItem && (
        <div className="activeClassBg">Chose</div>
      )}
      <img
        style={{
          width: '291px',
          height: '291px',
          // height: "auto",
          margin: '1rem 1rem',
          pointerEvents: 'none'
        }}
        src={
          metadata.image
            ? metadata.image
            : `${
                import.meta.env.VITE_IPFS_GATEWAY
              }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`
        }
        alt={metadata.name}
      />
    </button>
  );
};

export default OfferItem;
