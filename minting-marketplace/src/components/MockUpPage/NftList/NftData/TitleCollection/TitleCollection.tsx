import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { RootState } from '../../../../../ducks';
import { ColorChoice } from '../../../../../ducks/colors/colorStore.types';
import useWindowDimensions from '../../../../../hooks/useWindowDimensions';
import chainData from '../../../../../utils/blockchainData';
import { rFetch } from '../../../../../utils/rFetch';
import { TooltipBox } from '../../../../common/Tooltip/TooltipBox';
import defaultImage from '../../../../UserProfileSettings/images/defaultUserPictures.png';
import { ReactComponent as EtherScanCollectionLogo } from '../../../assets/EtherScanCollectionLogo.svg';
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
  selectedData,
  offerDataCol,
  connectUserData
}) => {
  const { contract, tokenId, blockchain } = useParams<TParamsTitleCollection>();
  const primaryColor = useSelector<RootState, ColorChoice>(
    (state) => state.colorStore.primaryColor
  );
  const [mintPopUp, setMintPopUp] = useState<boolean>(false);
  const [purchaseStatus, setPurchaseStatus] = useState<boolean>(false);

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

  const getContractInfo = useCallback(async () => {
    if (blockchain && contract) {
      const response = await rFetch(
        `/api/contracts/network/${blockchain}/${contract}`
      );

      if (response.success) {
        setExternal(response.contract.external);
      }
    }
  }, [blockchain, contract]);

  useEffect(() => {
    getContractInfo();
  }, [getContractInfo]);

  useEffect(() => {
    findCollectionPathExist();
  });

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
          <div className="block-user-creator">
            <span>by:</span>
            <ImageLazy
              src={someUsersData?.avatar ? someUsersData.avatar : defaultImage}
              alt="User Avatar"
            />
            <h5>
              {someUsersData && someUsersData.nickName
                ? someUsersData.nickName
                : userName && userName.length > 25
                ? `${userName.substring(0, 25)}...`
                : userName}
            </h5>
          </div>
        </div>
        <div
          style={{
            width: '400px'
          }}
          className={
            isCollectionPathExist
              ? `collection-authenticity-link-share ${
                  external ? 'external' : ''
                }`
              : 'tokens-share'
          }>
          {isCollectionPathExist && (
            <>
              {external === false && (
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
                        purchaseStatus ? 'rgb(74, 74, 74)' : 'var(--stimorol)'
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
                        purchaseStatus ? 'rgb(74, 74, 74)' : 'var(--stimorol)'
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
                    connectUserData={connectUserData}
                    someUsersData={someUsersData}
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
                chainData[blockchain]?.addChainData.blockExplorerUrls?.[0]
              }address/${contract}`}
              target="_blank"
              rel="noreferrer">
              <div className="etherscan-icon">
                <TooltipBox title=" Link to contract review">
                  <EtherScanCollectionLogo className="etherscan-collection-icon" />
                </TooltipBox>
              </div>
            </a>
          )}
          <div className="share-button-linear-border">
            <CustomShareButton
              title="Share"
              handleClick={handleClickOpen}
              primaryColor={primaryColor}
              isCollectionPathExist={isCollectionPathExist}
            />
            <SharePopUp
              primaryColor={primaryColor}
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
              selectedData={selectedData}
            />
          </div>
        </div>
      </div>
      {isCollectionPathExist &&
        selectedData &&
        selectedData.description !== 'none' &&
        selectedData.description !== 'No description available' && (
          <div className="block-collection-desc">
            {selectedData.description}
          </div>
        )}
    </div>
  );
};

export default TitleCollection;
