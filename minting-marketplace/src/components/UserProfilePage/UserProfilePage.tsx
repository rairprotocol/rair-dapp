import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Stack } from '@mui/material';
import { Breadcrumbs, Typography } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

import { TUserResponse } from '../../axios.responseTypes';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { UserType } from '../../ducks/users/users.types';
import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch';
import InputField from '../common/InputField';
import LoadingComponent from '../common/LoadingComponent';
import FilteringBlock from '../MockUpPage/FilteringBlock/FilteringBlock';
import { ImageLazy } from '../MockUpPage/ImageLazy/ImageLazy';
import CustomShareButton from '../MockUpPage/NftList/NftData/CustomShareButton';
import SharePopUp from '../MockUpPage/NftList/NftData/TitleCollection/SharePopUp/SharePopUp';
import { TDiamondTokensType } from '../nft/nft.types';
import { PersonalProfileMyNftTab } from '../nft/PersonalProfile/PersonalProfileMyNftTab/PersonalProfileMyNftTab';
import { PersonalProfileMyVideoTab } from '../nft/PersonalProfile/PersonalProfileMyVideoTab/PersonalProfileMyVideoTab';
import NotFound from '../NotFound/NotFound';
import { TSortChoice } from '../ResalePage/listOffers.types';
import { SvgUserIcon } from '../UserProfileSettings/SettingsIcons/SettingsIcons';

import { PersonalProfileIcon } from './../nft/PersonalProfile/PersonalProfileIcon/PersonalProfileIcon';
import UserProfileFavoritesTab from './UserProfileFavorites/UserProfileFavoritesTab';

import './UserProfilePage.css';

const UserProfilePage: React.FC = () => {
  const { primaryColor, textColor, headerLogo } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);
  const navigate = useNavigate();
  const { userAddress } = useParams();
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const [userData, setUserData] = useState<UserType | null | undefined>(
    undefined
  );
  const [tokens, setTokens] = useState<TDiamondTokensType[]>([]);
  const [collectedTokens, setCollectedTokens] = useState<TDiamondTokensType[]>(
    []
  );
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [loadingBg, setLoadingBg] = useState(false);
  const [sortItem, setSortItem] = useState<TSortChoice>();
  const [titleSearch, setTitleSearch] = useState('');
  const [tabIndexItems, setTabIndexItems] = useState(0);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const showTokensRef = useRef<number>(20);
  const [selectedValue, setSelectedValue] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const loader = useRef(null);

  const handleClose = (value: number) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const getMyNft = useCallback(
    async (number) => {
      setIsLoading(true);
      if (userAddress) {
        const response = await rFetch(
          `/api/nft/${userAddress}?itemsPerPage=${number}&pageNum=${1}`
        );
        if (response.success) {
          setTotalCount(response.totalCount);
          const tokenData: TDiamondTokensType[] = [];
          for await (const token of response.result) {
            if (!token.contract._id) {
              return;
            }
            const contractData = await rFetch(
              `/api/contracts/singleContract/${token.contract._id}`
            );
            tokenData.push({
              ...token,
              ...contractData.contract._id
            });
          }
          const newCollectedTokens = tokenData.filter(
            (el) => el.isMinted === true
          );
          setIsLoading(false);
          setTokens(tokenData);
          setCollectedTokens(newCollectedTokens);
        }

        if (response.error && response.message) {
          setIsLoading(false);
          return;
        }
      }
    },
    [userAddress]
  );

  const filteredData =
    tokens &&
    tokens
      .filter((item: TDiamondTokensType) => {
        return item?.title?.toLowerCase()?.includes(titleSearch?.toLowerCase());
      })
      .sort((a: TDiamondTokensType, b: TDiamondTokensType) => {
        if (sortItem === 'up') {
          if (a.title < b.title) {
            return -1;
          }
        }
        if (sortItem === 'down') {
          if (a.title > b.title) {
            return 1;
          }
        }

        return 0;
      });

  const loadToken = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        showTokensRef.current = showTokensRef.current + 20;
        getMyNft(Number(showTokensRef.current));
      }
    },
    [getMyNft, showTokensRef]
  );

  const getUserData = useCallback(async () => {
    if (userAddress) {
      const userAddressChanged = userAddress.toLowerCase();
      setTabIndexItems(0);
      setUserData(undefined);
      const response = await rFetch(`/api/users/${userAddressChanged}`);

      if (response.success) {
        setUserData(response.user);
      } else {
        setUserData(null);
      }
    }
  }, [userAddress]);

  const editBackground = useCallback(async () => {
    if (currentUserAddress) {
      const formData = new FormData();
      if (fileUpload) {
        setLoadingBg(true);
        formData.append('files', fileUpload);
        formData.append('background', fileUpload.name);

        const profileEditResponse = await axios.post<TUserResponse>(
          `/api/users/${currentUserAddress.toLowerCase()}`,
          formData,
          {
            headers: {
              Accept: 'multipart/form-data'
            }
          }
        );

        const { user, success } = profileEditResponse.data;
        if (success && user) {
          setFileUpload(null);
          setLoadingBg(false);
          getUserData();
        }
      }
    }
  }, [currentUserAddress, fileUpload, getUserData]);

  const breadcrumbs = [
    <NavLink key="1" to="/">
      <HomeIcon
        style={{
          borderRadius: '8px',
          padding: '2px',
          background: '#19A7F6',
          color: 'black'
        }}
        sx={{ fontSize: 'x-large' }}
      />
    </NavLink>,
    <Typography
      key="3"
      color={`${primaryColor === 'rhyno' ? 'black' : 'white'}`}>
      {(userData && userData.nickName && userData.nickName.length > 20
        ? userData.nickName.slice(0, 5) + '....' + userData.nickName.slice(38)
        : userData?.nickName) ||
        (userAddress &&
          userAddress.slice(0, 4) + '....' + userAddress.slice(38))}
    </Typography>
  ];

  const photoUpload = useCallback((e) => {
    e.preventDefault();
    const reader = new FileReader();
    const fileF = e.target.files[0];
    reader.onloadend = () => {
      if (fileF.type !== 'video/mp4') {
        setFileUpload(fileF);
      } else {
        Swal.fire('Info', `You cannot upload video to background!`, 'warning');
      }
    };
    if (fileF) {
      reader.readAsDataURL(fileF);
    }
  }, []);

  useEffect(() => {
    editBackground();
  }, [editBackground]);

  useEffect(() => {
    getMyNft(showTokensRef.current);
  }, [getMyNft, showTokensRef]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  // useEffect(() => {
  if (userData === null) {
    // navigate('/404');
    return <NotFound />;
  }
  // }, [userData, navigate]);

  if (userData === undefined) {
    return <LoadingComponent />;
  }

  return (
    <div className="container">
      <div>
        <SharePopUp
          primaryColor={primaryColor}
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
        />
      </div>
      {userData ? (
        <>
          <div className="breadcrumbs">
            <Stack
              style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }}
              spacing={2}>
              <Breadcrumbs
                color="white"
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Stack>
          </div>
          <div
            className={`user-page-background ${primaryColor}`}
            style={{
              backgroundImage:
                userData && userData?.background
                  ? `url(${userData?.background})`
                  : ''
            }}>
            {userData && !userData.background && (
              <img src={headerLogo} alt="background-logo-default" />
            )}
            {currentUserAddress &&
              currentUserAddress &&
              currentUserAddress === userAddress && (
                <div
                  className={'blockAddBack'}
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0'
                  }}>
                  <label className={'inputFile'}>
                    <AddIcon className={'plus'} />
                    <input
                      disabled={loadingBg ? true : false}
                      type="file"
                      onChange={photoUpload}
                    />
                  </label>
                </div>
              )}
          </div>
          <div
            className={`my-items-header-wrapper user ${
              currentUserAddress === userAddress && 'edit'
            }`}>
            {currentUserAddress === userAddress ? (
              <>
                <PersonalProfileIcon
                  userData={userData}
                  setEditModeUpper={setEditMode}
                />
              </>
            ) : (
              <div className="personal-profile-box">
                <div className="profile-avatar-block">
                  {userData.avatar ? (
                    <ImageLazy
                      className="profile-avatar-img"
                      alt="User Avatar"
                      src={userData.avatar ? userData.avatar : ''}
                    />
                  ) : (
                    <div className="personal-default-avatar">
                      <SvgUserIcon />
                    </div>
                  )}
                </div>
                <div className="profile-name-box">
                  <>
                    <span className={`profileName ${textColor}`}>
                      {(userData &&
                      userData.nickName &&
                      userData.nickName.length > 20
                        ? userData.nickName.slice(0, 5) +
                          '....' +
                          userData.nickName.slice(38)
                        : userData.nickName) ||
                        (userAddress &&
                          userAddress.slice(0, 4) +
                            '....' +
                            userAddress.slice(38))}
                    </span>
                  </>
                </div>
              </div>
            )}
            {!editMode && (
              <CustomShareButton
                title="Share"
                handleClick={handleClickOpen}
                primaryColor={primaryColor}
              />
            )}
          </div>
          <div className="tabs-section">
            <Tabs
              selectedIndex={tabIndexItems}
              onSelect={(index) => setTabIndexItems(index)}>
              <TabList className="category-wrapper">
                <Tab
                  selectedClassName={`search-tab-selected-${
                    primaryColor === 'rhyno' ? 'default' : 'dark'
                  }`}
                  style={{
                    backgroundColor: `${
                      primaryColor === 'rhyno' ? '#fafafa' : '#222021'
                    }`,
                    border: `1px solid ${
                      primaryColor === 'rhyno' ? 'var(--rhyno)' : '#4E4D4D'
                    }`
                  }}
                  className="category-button-nft category-button">
                  Collected
                </Tab>
                <Tab
                  selectedClassName={`search-tab-selected-${
                    primaryColor === 'rhyno' ? 'default' : 'dark'
                  }`}
                  style={{
                    backgroundColor: `${
                      primaryColor === 'rhyno' ? '#fafafa' : '#222021'
                    }`,
                    border: `1px solid ${
                      primaryColor === 'rhyno' ? 'var(--rhyno)' : '#4E4D4D'
                    }`
                  }}
                  className="category-button-videos category-button">
                  Created
                </Tab>
                <Tab
                  selectedClassName={`search-tab-selected-${
                    primaryColor === 'rhyno' ? 'default' : 'dark'
                  }`}
                  style={{
                    backgroundColor: `${
                      primaryColor === 'rhyno' ? '#fafafa' : '#222021'
                    }`,
                    border: `1px solid ${
                      primaryColor === 'rhyno' ? 'var(--rhyno)' : '#4E4D4D'
                    }`
                  }}
                  className="category-button-videos category-button">
                  Favorited
                </Tab>
                <Tab
                  selectedClassName={`search-tab-selected-${
                    primaryColor === 'rhyno' ? 'default' : 'dark'
                  }`}
                  style={{
                    backgroundColor: `${
                      primaryColor === 'rhyno' ? '#fafafa' : '#222021'
                    }`,
                    border: `1px solid ${
                      primaryColor === 'rhyno' ? 'var(--rhyno)' : '#4E4D4D'
                    }`
                  }}
                  className="category-button-videos category-button">
                  Videos
                </Tab>
              </TabList>
              <div className="bar-wrapper">
                <InputField
                  getter={titleSearch}
                  setter={setTitleSearch}
                  placeholder={'Search...'}
                  customCSS={{
                    backgroundColor: `var(--${
                      primaryColor === 'charcoal' ? 'charcoal-90' : `rhyno-40`
                    })`,
                    // color: `var(--${textColor})`,
                    borderTopLeftRadius: '0',
                    border: `${
                      primaryColor === 'charcoal'
                        ? 'solid 1px var(--charcoal-80)'
                        : 'solid 1px var(--rhyno)'
                    } `
                  }}
                  customClass="form-control input-styled user-search"
                />
                <i
                  className="fas fa-search fa-lg fas-custom"
                  aria-hidden="true"></i>
                <FilteringBlock
                  primaryColor={primaryColor}
                  setSortItem={setSortItem}
                  sortItem={sortItem}
                  isFilterShow={false}
                />
              </div>
              <div className="user-page-main-tab-block">
                <TabPanel>
                  <PersonalProfileMyNftTab
                    filteredData={collectedTokens && collectedTokens}
                    defaultImg={
                      'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW'
                    }
                    chainData={chainData}
                    textColor={textColor}
                  />
                </TabPanel>
                <TabPanel>
                  <PersonalProfileMyNftTab
                    filteredData={filteredData && filteredData}
                    defaultImg={
                      'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW'
                    }
                    chainData={chainData}
                    textColor={textColor}
                    totalCount={totalCount}
                    showTokensRef={showTokensRef}
                    loader={loader}
                    isLoading={isLoading}
                    loadToken={loadToken}
                  />
                </TabPanel>
                <TabPanel>
                  <UserProfileFavoritesTab
                    userAddress={userAddress}
                    titleSearch={titleSearch}
                  />
                </TabPanel>
                <TabPanel>
                  <PersonalProfileMyVideoTab
                    publicAddress={userData.publicAddress}
                    titleSearch={titleSearch}
                  />
                </TabPanel>
              </div>
            </Tabs>
          </div>
        </>
      ) : (
        <>
          <h2>User is not found</h2>
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
