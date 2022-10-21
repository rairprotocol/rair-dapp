import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { RootState } from '../../../../../ducks';
import { ColorChoice } from '../../../../../ducks/colors/colorStore.types';
import chainData from '../../../../../utils/blockchainData';
import defaultImage from '../../../../UserProfileSettings/images/defaultUserPictures.png';
import { ReactComponent as EtherScanCollectionLogo } from '../../../assets/EtherScanCollectionLogo.svg';
import { ImageLazy } from '../../../ImageLazy/ImageLazy';
import {
  ITitleCollection,
  TParamsTitleCollection
} from '../../../mockupPage.types';
import CustomShareButton from '../CustomShareButton';

import SharePopUp from './SharePopUp/SharePopUp';

import './TitleCollection.css';

const TitleCollection: React.FC<ITitleCollection> = ({
  title,
  userName,
  someUsersData,
  selectedData
}) => {
  const { contract, tokenId, blockchain } = useParams<TParamsTitleCollection>();
  const primaryColor = useSelector<RootState, ColorChoice>(
    (state) => state.colorStore.primaryColor
  );

  const location = useLocation();

  const [selectedValue, setSelectedValue] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [isCollectionPathExist, setIsCollectionPathExist] =
    useState<boolean>(false);

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

  useEffect(() => {
    findCollectionPathExist();
  });

  return (
    <div className="title-collection-container">
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
          className={
            isCollectionPathExist
              ? 'collection-authenticity-link-share'
              : 'tokens-share'
          }>
          {isCollectionPathExist && (
            <a
              href={`${
                blockchain &&
                chainData[blockchain]?.addChainData.blockExplorerUrls?.[0]
              }address/${contract}`}
              target="_blank"
              rel="noreferrer">
              <div className="etherscan-icon">
                <EtherScanCollectionLogo className="etherscan-collection-icon" />
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
