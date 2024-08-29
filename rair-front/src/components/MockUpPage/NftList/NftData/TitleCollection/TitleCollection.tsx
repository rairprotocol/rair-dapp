import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { useAppSelector } from '../../../../../hooks/useReduxHooks';
import useServerSettings from '../../../../../hooks/useServerSettings';
import useWindowDimensions from '../../../../../hooks/useWindowDimensions';
import { rFetch } from '../../../../../utils/rFetch';
import { ContractType } from '../../../../adminViews/adminView.types';
import { TooltipBox } from '../../../../common/Tooltip/TooltipBox';
import defaultImage from '../../../../UserProfileSettings/images/defaultUserPictures.png';
import EtherScanCollectionLogo from '../../../assets/EtherScanCollectionLogo.svg?react';
import { ImageLazy } from '../../../ImageLazy/ImageLazy';
import {
  ITitleCollection,
  TParamsTitleCollection
} from '../../../mockupPage.types';
import CustomButton from '../../../utils/button/CustomButton';
import CustomShareButton from '../CustomShareButton';

import MintPopUpCollection from './MintPopUpCollection/MintPopUpCollection';
import SharePopUp from './SharePopUp/SharePopUp';

import './TitleCollection.css';

const TitleCollection: React.FC<ITitleCollection> = ({
  title,
  userName,
  someUsersData,
  offerDataCol
}) => {
  const { contract, tokenId, blockchain } = useParams<TParamsTitleCollection>();
  const { primaryColor, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );

  const [mintPopUp, setMintPopUp] = useState<boolean>(false);
  const [purchaseStatus, setPurchaseStatus] = useState<boolean>(false);
  const [contractData, setContractData] = useState<ContractType>();

  const location = useLocation();

  const [selectedValue, setSelectedValue] = useState<number>(0);
  const [external, setExternal] = useState<boolean | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [isCollectionPathExist, setIsCollectionPathExist] =
    useState<boolean>(false);

  const { width } = useWindowDimensions();

  const handleClose = (value: number) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const { getBlockchainData } = useServerSettings();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleTitleColor = () => {
    if (title) {
      if (title.includes('#')) {
        const val = title.slice(title.indexOf('#'));
        return (
          <>
            <span>{title.slice(0, title.indexOf('#'))}</span>{' '}
            <span className="block-title-purple">{val}</span>
          </>
        );
      } else {
        return title;
      }
    }
  };

  const findCollectionPathExist = () => {
    if (location.pathname.includes('collection')) {
      setIsCollectionPathExist(true);
    } else {
      setIsCollectionPathExist(false);
    }
  };

  const disableBuyBtn = useCallback(() => {
    if (offerDataCol) {
      if (!contractData || !offerDataCol[0]?.offerIndex) {
        return true;
      } else if (contractData.diamond) {
        return !offerDataCol[0].diamondRangeIndex;
      } else {
        return !offerDataCol[0].offerPool;
      }
    }
  }, [offerDataCol, contractData]);

  const getContractInfo = useCallback(async () => {
    if (blockchain && contract) {
      const response = await rFetch(
        `/api/contracts/network/${blockchain}/${contract}`
      );

      if (response.success) {
        setExternal(response.contract.external);
        setContractData(response.contract);
      }
    }
  }, [blockchain, contract]);

  useEffect(() => {
    getContractInfo();

    return () => {
      setExternal(undefined);
    };
  }, [getContractInfo]);

  useEffect(() => {
    findCollectionPathExist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`title-collection-container ${offerDataCol ? 'minted' : ''}`}>
      <div className="title-collection-wrapper">
        <div className="container-title-collection">
          <div className="block-title-share">
            <h2
              className={title && title !== 'none' ? '' : 'block-title-purple'}>
              {title === 'none' ? `#${tokenId}` : handleTitleColor()}
            </h2>
          </div>
          <NavLink
            to={`/${someUsersData ? someUsersData.publicAddress : userName}`}>
            <div className="block-user-creator">
              <span>by:</span>
              <ImageLazy
                src={
                  someUsersData?.avatar ? someUsersData.avatar : defaultImage
                }
                alt="User Avatar"
              />
              <h5>
                {(someUsersData &&
                someUsersData.nickName &&
                someUsersData.nickName.length > 20
                  ? someUsersData.nickName.slice(0, 5) +
                    '....' +
                    someUsersData.nickName.slice(length - 4)
                  : someUsersData && someUsersData.nickName) ||
                  (userName &&
                    userName.slice(0, 4) + '....' + userName.slice(length - 4))}
              </h5>
            </div>
          </NavLink>
        </div>
        <div
          style={{
            width: '400px'
          }}
          className={
            isCollectionPathExist
              ? `collection-authenticity-link-share ${
                  external || disableBuyBtn() === true ? 'external' : ''
                }`
              : 'tokens-share'
          }>
          {isCollectionPathExist && (
            <>
              {disableBuyBtn() === false && external === false && (
                <>
                  {width >= 500 ? (
                    <CustomButton
                      onClick={() => {
                        if (purchaseStatus) {
                          return;
                        } else {
                          setMintPopUp(true);
                        }
                      }}
                      width="161px"
                      height="48px"
                      // margin="20px 0 0 0"
                      text="Mint!"
                      background={`${
                        primaryColor === '#dedede'
                          ? import.meta.env.VITE_TESTNET === 'true'
                            ? 'var(--hot-drops)'
                            : 'linear-gradient(to right, #e882d5, #725bdb)'
                          : import.meta.env.VITE_TESTNET === 'true'
                            ? primaryButtonColor ===
                              'linear-gradient(to right, #e882d5, #725bdb)'
                              ? 'var(--hot-drops)'
                              : primaryButtonColor
                            : primaryButtonColor
                      }`}
                      hoverBackground={`${
                        purchaseStatus ? 'rgb(74, 74, 74)' : ''
                      }`}
                    />
                  ) : (
                    <CustomButton
                      onClick={() => {
                        if (purchaseStatus) {
                          return;
                        } else {
                          setMintPopUp(true);
                        }
                      }}
                      width="120px"
                      height="40px"
                      // margin="20px 0 0 0"
                      text="Mint!"
                      background={`${
                        primaryColor === '#dedede'
                          ? import.meta.env.VITE_TESTNET === 'true'
                            ? 'var(--hot-drops)'
                            : 'linear-gradient(to right, #e882d5, #725bdb)'
                          : import.meta.env.VITE_TESTNET === 'true'
                            ? primaryButtonColor ===
                              'linear-gradient(to right, #e882d5, #725bdb)'
                              ? 'var(--hot-drops)'
                              : primaryButtonColor
                            : primaryButtonColor
                      }`}
                      hoverBackground={`${
                        purchaseStatus ? 'rgb(74, 74, 74)' : ''
                      }`}
                    />
                  )}
                </>
              )}
              <Popup
                // className="popup-settings-block"
                open={mintPopUp}
                // position="right center"
                closeOnDocumentClick
                onClose={() => {
                  setMintPopUp(false);
                }}>
                {offerDataCol && (
                  <MintPopUpCollection
                    blockchain={blockchain}
                    offerDataCol={offerDataCol}
                    primaryColor={primaryColor}
                    contractAddress={contract}
                    setPurchaseStatus={setPurchaseStatus}
                  />
                )}
              </Popup>
            </>
          )}
          {isCollectionPathExist && (
            <a
              href={`${
                blockchain &&
                getBlockchainData(blockchain)?.blockExplorerGateway
              }/address/${contract}`}
              target="_blank"
              rel="noreferrer">
              <div
                className={`etherscan-icon ${
                  import.meta.env.VITE_TESTNET === 'true'
                    ? 'hotdrops-border'
                    : ''
                }`}>
                <TooltipBox title="Link to Contract Review">
                  <div>
                    <EtherScanCollectionLogo className="etherscan-collection-icon" />
                  </div>
                </TooltipBox>
              </div>
            </a>
          )}
          <div className="share-button-linear-border">
            <CustomShareButton
              title="Share"
              handleClick={handleClickOpen}
              isCollectionPathExist={isCollectionPathExist}
            />
            <SharePopUp
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleCollection;
