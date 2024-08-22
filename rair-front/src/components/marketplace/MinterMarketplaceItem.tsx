import { FC } from 'react';
import { Provider, useStore } from 'react-redux';

import BuyTokenModalContent from './BuyTokenModalContent';
import { TMinterMarketplaceItemType } from './marketplace.types';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';

const MinterMarketplaceItem: FC<TMinterMarketplaceItemType> = ({
  item,
  index,
  colWidth
}) => {
  const { primaryColor, secondaryColor, textColor, secondaryButtonColor } =
    useAppSelector((state) => state.colors);
  const store = useStore();
  const reactSwal = useSwal();
  const { correctBlockchain } = useWeb3Tx();
  const { getBlockchainData } = useServerSettings();

  const onMyChain = correctBlockchain(item?.blockchain);

  return (
    <div key={index} className={`col-${colWidth ? colWidth : 4} p-2`}>
      <div
        style={{
          border: `solid 1px ${textColor}`,
          backgroundImage: `url(${getBlockchainData(item.blockchain)?.image})`,
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
        for {item.price} {getBlockchainData(item.blockchain)?.name} wei <br />
        <small>{/*item.totalCopies*/}</small>
        <br />
        <button
          id={`button_${index}`}
          onClick={async () => {
            if (!onMyChain) {
              if (window.ethereum) {
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [
                    { chainId: getBlockchainData(item.blockchain)?.hash }
                  ]
                });
              } else {
                // Code for suresh goes here
              }
            } else {
              reactSwal.fire({
                html: (
                  <Provider store={store}>
                    <BuyTokenModalContent
                      blockchain={item.blockchain}
                      price={BigInt(item.price)}
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
              Switch to <b>{getBlockchainData(item.blockchain)?.name}</b>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MinterMarketplaceItem;
