import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../ducks';
import { ColorChoice } from '../../../../ducks/colors/colorStore.types';
import { IEtherscanIconComponent } from '../../mockupPage.types';
import { ReactComponent as EtherscanDark } from '../../assets/EtherscanDark.svg';
import { ReactComponent as EtherscanLight } from '../../assets/EtherscanLight.svg';
import chainData from '../../../../utils/blockchainData';
import LikeButton from '../LikeButton/LikeButton';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import { Tooltip } from '@mui/material';

const EtherscanIconComponent: React.FC<IEtherscanIconComponent> = ({
  classTitle,
  contract,
  selectedToken,
  blockchain,
  currentTokenId
}) => {
  const primaryColor = useSelector<RootState, ColorChoice>(
    (state) => state.colorStore.primaryColor
  );

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  return (
    <>
      {blockchain && chainData[blockchain] && (
        <div className={classTitle}>
          <a
            href={`${chainData[blockchain]?.addChainData.blockExplorerUrls?.[0]}token/${contract}?a=${selectedToken}`}
            target="_blank"
            rel="noreferrer">
            {primaryColor === 'charcoal' ? (
              <Tooltip placement="left" arrow title={'Token Address'}>
                <div className="etherscan-icon-token-dark">
                  <EtherscanDark className="nft-collection-icons-icon" />
                </div>
              </Tooltip>
            ) : (
              <Tooltip placement="left" arrow title={'Token Address'}>
                <div className="etherscan-icon-token-light">
                  <EtherscanLight className="nft-collection-icons-icon" />
                </div>
              </Tooltip>
            )}
          </a>
          {currentUserAddress && (
            <>
              {primaryColor === 'charcoal' ? (
                <div className="etherscan-icon-token-dark">
                  <LikeButton
                    selectedToken={selectedToken}
                    tokenId={currentTokenId}
                    likeButtonStyle="nft-collection-icons-icon"
                  />
                </div>
              ) : (
                <div className="etherscan-icon-token-light">
                  <LikeButton
                    selectedToken={selectedToken}
                    tokenId={currentTokenId}
                    likeButtonStyle="nft-collection-icons-icon"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default React.memo(EtherscanIconComponent);
