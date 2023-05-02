import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Stack } from '@mui/material';
import { Breadcrumbs, Typography } from '@mui/material';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { UserType } from '../../ducks/users/users.types';
import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch';
import InputField from '../common/InputField';
import LoadingComponent from '../common/LoadingComponent';
import FilteringBlock from '../MockUpPage/FilteringBlock/FilteringBlock';
import { ImageLazy } from '../MockUpPage/ImageLazy/ImageLazy';
import { TDiamondTokensType } from '../nft/nft.types';
import { PersonalProfileMyNftTab } from '../nft/PersonalProfile/PersonalProfileMyNftTab/PersonalProfileMyNftTab';
import { PersonalProfileMyVideoTab } from '../nft/PersonalProfile/PersonalProfileMyVideoTab/PersonalProfileMyVideoTab';
import { TSortChoice } from '../ResalePage/listOffers.types';
import { SvgUserIcon } from '../UserProfileSettings/SettingsIcons/SettingsIcons';

import UserProfileFavoritesTab from './UserProfileFavorites/UserProfileFavoritesTab';

import './UserProfilePage.css';

const UserProfilePage: React.FC = () => {
  const { primaryColor, textColor, headerLogo } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);
  const navigate = useNavigate();
  const { userAddress } = useParams();
  const [userData, setUserData] = useState<UserType | null | undefined>(
    undefined
  );
  const [tokens, setTokens] = useState<TDiamondTokensType[]>([]);
  const [collectedTokens, setCollectedTokens] = useState<TDiamondTokensType[]>(
    []
  );
  const [sortItem, setSortItem] = useState<TSortChoice>();
  const [titleSearch, setTitleSearch] = useState('');
  const [tabIndexItems, setTabIndexItems] = useState(0);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const showTokensRef = useRef<number>(20);
  const loader = useRef(null);

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
            if (!token.contract) {
              return;
            }
            const contractData = await rFetch(
              `/api/contracts/singleContract/${token.contract}`
            );
            tokenData.push({
              ...token,
              ...contractData.contract
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

  useEffect(() => {
    getMyNft(showTokensRef.current);
  }, [getMyNft, showTokensRef]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  useEffect(() => {
    if (userData === null) {
      navigate('*');
    }
  }, [userData, navigate]);

  if (userData === undefined) {
    return <LoadingComponent />;
  }

  return (
    <div className="container">
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
          </div>
          <div className="my-items-header-wrapper user">
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
