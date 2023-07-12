import React from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from '@mui/material';

import { RootState } from '../../../../ducks';
import { ColorChoice } from '../../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import chainData from '../../../../utils/blockchainData';
import { TooltipBox } from '../../../common/Tooltip/TooltipBox';
import { ReactComponent as EtherscanDark } from '../../assets/EtherscanDark.svg';
import { ReactComponent as EtherscanLight } from '../../assets/EtherscanLight.svg';
import { IEtherscanIconComponent } from '../../mockupPage.types';
import LikeButton from '../LikeButton/LikeButton';

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

  const hotdropsVar = process.env.REACT_APP_HOTDROPS;

  return (
    <>
      {blockchain && chainData[blockchain] && (
        <div className={classTitle}>
          <a
            href={`${chainData[blockchain]?.addChainData.blockExplorerUrls?.[0]}token/${contract}?a=${selectedToken}`}
            target="_blank"
            rel="noreferrer">
            {primaryColor === 'charcoal' ? (
              <div
                className={`etherscan-icon-token-dark ${
                  hotdropsVar === 'true' ? 'hotdrops-border' : ''
                }`}>
                <TooltipBox position="top" title="Token Address">
                  <EtherscanDark className="nft-collection-icons-icon" />
                </TooltipBox>
              </div>
            ) : (
              <div
                className={`etherscan-icon-token-light ${
                  hotdropsVar === 'true' ? 'hotdrops-border' : ''
                }`}>
                <TooltipBox position="top" title="Token Address">
                  <EtherscanLight className="nft-collection-icons-icon" />
                </TooltipBox>
              </div>
            )}
          </a>
          {currentUserAddress && (
            <>
              {primaryColor === 'charcoal' ? (
                <div
                  className={`etherscan-icon-token-dark ${
                    hotdropsVar === 'true' ? 'hotdrops-border' : ''
                  }`}>
                  <LikeButton
                    selectedToken={selectedToken}
                    tokenId={currentTokenId}
                    likeButtonStyle="nft-collection-icons-icon"
                  />
                </div>
              ) : (
                <div
                  className={`etherscan-icon-token-light ${
                    hotdropsVar === 'true' ? 'hotdrops-border' : ''
                  }`}>
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
