import React from 'react';
import { Provider, useSelector, useStore } from 'react-redux';
import { BigNumber } from 'ethers';

import BuyTokenModalContent from './BuyTokenModalContent';
import { TMinterMarketplaceItemType } from './marketplace.types';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useSwal from '../../hooks/useSwal';
import chainData from '../../utils/blockchainData';

const MinterMarketplaceItem: React.FC<TMinterMarketplaceItemType> = ({
  item,
  index,
  colWidth
}) => {
  const { primaryColor, secondaryColor, textColor, secondaryButtonColor } =
    useSelector<RootState, ColorStoreType>((state) => state.colorStore);
  const { currentChain } = useSelector<RootState, ContractsInitialType>(
    (state) => state.contractStore
  );
  const store = useStore();
  const reactSwal = useSwal();

  const onMyChain = chainData[item.blockchain]?.chainId === currentChain;

  return (
    <div key={index} className={`col-${colWidth ? colWidth : 4} p-2`}>
      <div
        style={{
          border: `solid 1px ${textColor}`,
          backgroundImage: `url(${chainData[item?.blockchain]?.image})`,
          backgroundColor: `var(--${primaryColor}-transparent)`
        }}
        className="w-100 p-3 bg-blockchain">
        {item.productName}
        <br />
        <small style={{ fontSize: '0.7rem' }}>{item.contractAddress}</small>
        <br />
        <b>{item.offerName}</b>
        <br />
        {Number(item.range[1]) -
          Number(item.range[0]) -
          item.soldCopies +
          1}{' '}
        tokens up for sale <br />
        for {item.price} {chainData[item.blockchain]?.name} wei <br />
        <small>{/*item.totalCopies*/}</small>
        <br />
        <button
          id={`button_${index}`}
          onClick={async () => {
            if (!onMyChain) {
              if (window.ethereum) {
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: chainData[item.blockchain]?.chainId }]
                });
              } else {
                // Code for suresh goes here
              }
            } else {
              reactSwal.fire({
                html: (
                  <Provider store={store}>
                    <BuyTokenModalContent
                      minterAddress={item.minterAddress}
                      blockchain={item.blockchain}
                      price={BigNumber.from(item.price)}
                      start={item.range[0]}
                      end={item.range[1]}
                      offerName={item.offerName}
                      offerIndex={item.offerPool}
                      rangeIndex={item.offerIndex}
                    />
                  </Provider>
                ),
                showConfirmButton: false,
                width: '70vw',
                customClass: {
                  popup: `bg-${primaryColor}`,
                  htmlContainer: `text-${secondaryColor}`
                }
              });
            }
          }}
          style={{
            background: secondaryButtonColor,
            color: textColor
          }}
          className="btn rair-button py-0">
          {onMyChain ? (
            <>Buy</>
          ) : (
            <>
              Switch to <b>{chainData[item.blockchain]?.name}</b>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MinterMarketplaceItem;
