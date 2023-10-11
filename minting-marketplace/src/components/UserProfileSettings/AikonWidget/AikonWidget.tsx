import React from 'react';
import { useSelector } from 'react-redux';
import { useOreId } from 'oreid-react';

import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { RootState } from '../../../ducks/index';

const AikonWidget: React.FC = () => {
  const oreId = useOreId();
  const { currentUserAddress, currentChain } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);

  const oreIdMappingToChainHash = {
    eth_main: '0x1' as BlockchainType,
    eth_goerli: '0x5' as BlockchainType,
    polygon_main: '0x89' as BlockchainType,
    polygon_mumbai: '0x13881' as BlockchainType
  };

  const currentChainValue = currentChain;

  const mappedChainHash = Object.keys(oreIdMappingToChainHash).find(
    (key) => oreIdMappingToChainHash[key] === currentChainValue
  );

  // const isTestNetwork =
  //   mappedChainHash === '0x5' || mappedChainHash === '0x13881';

  const handleBuy = async () => {
    const buyParams = {
      chainAccount: currentUserAddress || '',
      chainNetwork: mappedChainHash || '',
      limitToChains: ['polygon_main', 'polygon_mumbai'],
      limitToSymbols: ['matic'],
      // useTestMode: isTestNetwork
      useTestMode: false
    };

    try {
      await oreId.popup.buy(buyParams);
      // const buyResult = await oreId.popup.buy(buyParams);
      // console.info('Buy Result:', buyResult);
    } catch (error) {
      // eslint-disable-next-line no-console
      // console.error('Error in buy:', error);
    }
  };

  return (
    <div className="aikon-widget-block" onClick={handleBuy}>
      <i className="fas fa-wallet"></i>
    </div>
  );
};

export default AikonWidget;
