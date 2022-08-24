import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../ducks';
import { ColorChoice } from '../../../../ducks/colors/colorStore.types';
import { IEtherscanIconComponent } from '../../mockupPage.types';
import { ReactComponent as EtherscanDark } from '../../assets/EtherscanDark.svg';
import { ReactComponent as EtherscanLight } from '../../assets/EtherscanLight.svg';
import chainData from '../../../../utils/blockchainData';
import LikeButton from '../LikeButton/LikeButton';

const EtherscanIconComponent: React.FC<IEtherscanIconComponent> = ({
  classTitle,
  contract,
  selectedToken,
  blockchain
}) => {
  const primaryColor = useSelector<RootState, ColorChoice>(
    (state) => state.colorStore.primaryColor
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
              <div className="etherscan-icon-token-dark">
                <EtherscanDark className="nft-collection-icons-icon" />
              </div>
            ) : (
              <div className="etherscan-icon-token-light">
                <EtherscanLight className="nft-collection-icons-icon" />
              </div>
            )}
          </a>
          {primaryColor === 'charcoal' ? (
            <div className="etherscan-icon-token-dark">
              <LikeButton likeButtonStyle="nft-collection-icons-icon" />
            </div>
          ) : (
            <div className="etherscan-icon-token-light">
              <LikeButton likeButtonStyle="nft-collection-icons-icon" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default React.memo(EtherscanIconComponent);
