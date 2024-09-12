import { FC, memo } from 'react';

import { useAppSelector } from '../../../../hooks/useReduxHooks';
import useServerSettings from '../../../../hooks/useServerSettings';
import { TooltipBox } from '../../../common/Tooltip/TooltipBox';
import EtherscanDark from '../../assets/EtherscanDark.svg?react';
import EtherscanLight from '../../assets/EtherscanLight.svg?react';
import { IEtherscanIconComponent } from '../../mockupPage.types';
import LikeButton from '../LikeButton/LikeButton';

const EtherscanIconComponent: FC<IEtherscanIconComponent> = ({
  classTitle,
  contract,
  selectedToken,
  blockchain,
  currentTokenId
}) => {
  const { isDarkMode } = useAppSelector((store) => store.colors);
  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const { getBlockchainData } = useServerSettings();

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  return (
    <>
      {blockchain && getBlockchainData(blockchain) && (
        <div className={classTitle}>
          <a
            href={`${
              getBlockchainData(blockchain)?.blockExplorerGateway
            }/token/${contract}?a=${selectedToken}`}
            target="_blank"
            rel="noreferrer">
            <div
              className={`etherscan-icon-token-${isDarkMode ? 'dark' : 'light'} ${
                hotdropsVar === 'true' ? 'hotdrops-border' : ''
              }`}>
              <TooltipBox position="top" title="Token Address">
                <div>
                  {isDarkMode ? (
                    <EtherscanDark className="nft-collection-icons-icon" />
                  ) : (
                    <EtherscanLight className="nft-collection-icons-icon" />
                  )}
                </div>
              </TooltipBox>
            </div>
          </a>
          {currentUserAddress && (
            <div
              className={`etherscan-icon-token-${isDarkMode ? 'dark' : 'light'} ${
                hotdropsVar === 'true' ? 'hotdrops-border' : ''
              }`}>
              <LikeButton
                selectedToken={selectedToken}
                tokenId={currentTokenId}
                likeButtonStyle="nft-collection-icons-icon"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default memo(EtherscanIconComponent);
