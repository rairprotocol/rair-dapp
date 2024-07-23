import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

import { RootState } from '../../ducks';
import { getTokenError } from '../../ducks/auth/actions';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch';
import setDocumentTitle from '../../utils/setTitle';
import InputField from '../common/InputField';
import FilteringBlock from '../MockUpPage/FilteringBlock/FilteringBlock';
import { TSortChoice } from '../MockUpPage/FilteringBlock/filteringBlock.types';
import ModalItem from '../MockUpPage/FilteringBlock/portal/ModalItem/ModalItem';
import { IMyItems, TDiamondTokensType } from '../nft/nft.types';
import { PersonalProfileBackground } from '../nft/PersonalProfile/PersonalProfileBackground/PersonalProfileBackground';
import PersonalProfileFavoritesTab from '../nft/PersonalProfile/PersonalProfileFavoritesTab/PersonalProfileFavoritesTab';
import { PersonalProfileMyCreated } from '../nft/PersonalProfile/PersonalProfileMyCreated/PersonalProfileMyCreated';
import { PersonalProfileMyNftTab } from '../nft/PersonalProfile/PersonalProfileMyNftTab/PersonalProfileMyNftTab';
import { PersonalProfileMyVideoTab } from '../nft/PersonalProfile/PersonalProfileMyVideoTab/PersonalProfileMyVideoTab';

import './UserProfile.css';

const UserProfile: React.FC<IMyItems> = ({
  // userData,
  // setIsSplashPage,
  // setTabIndexItems,
  tabIndexItems
}) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const defaultImg = `${
    import.meta.env.VITE_IPFS_GATEWAY
  }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`;

  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (state) => state.colorStore
  );
  const [tokens, setTokens] = useState<TDiamondTokensType[]>([]);
  const [selectedData, setSelectedData] =
    useState<TDiamondTokensType /*| TMyDiamondItemsToken*/>();
  const [titleSearch, setTitleSearch] = useState<string>('');
  const [sortItem, setSortItem] = useState<TSortChoice>();
  const [isOpenBlockchain, setIsOpenBlockchain] = useState<boolean>(false);
  const [isCreatedTab, setIsCreatedTab] = useState<boolean>(false);

  const getMyNft = useCallback(async () => {
    const response = await rFetch('/api/nft');

    if (response.success) {
      const tokenData: TDiamondTokensType[] = [];
      for await (const token of response.result) {
        if (!token.contract) {
          return;
        }
        const contractData = await rFetch(`/api/contracts/${token.contract}`);
        tokenData.push({
          ...token,
          ...contractData.contract
        });
      }
      setTokens(tokenData);
    }

    if (response.error && response.message) {
      dispatch(getTokenError(response.error));
    }
  }, [dispatch]);

  const openModal = () => {
    setIsOpenBlockchain(true);
  };

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
    <Typography key="3" color={textColor}>
      Username
    </Typography>
  ];

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

  useEffect(() => {
    getMyNft();
  }, [getMyNft]);

  useEffect(() => {
    setDocumentTitle('My profile');
    window.scrollTo(0, 0);
  });

  return (
    <div className="container">
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

      <PersonalProfileBackground />

      <div className="user-header-wrapper">
        {/* <PersonalProfileIcon userData={userData} /> */}
      </div>

      <div className="tabs-section">
        <Tabs
          selectedIndex={tabIndexItems}
          // onSelect={(index) => setTabIndexItems(index)}
        >
          <TabList className="category-wrapper">
            <Tab //////NFTs Collected
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
              {width <= 700 ? 'NFT' : 'NFTs Collected'}
            </Tab>

            <Tab //////Videos Created
              style={{
                backgroundColor: `${
                  primaryColor === 'rhyno' ? '#fafafa' : '#222021'
                }`,
                border: `1px solid ${
                  primaryColor === 'rhyno' ? 'var(--rhyno)' : '#4E4D4D'
                }`
              }}
              selectedClassName={`search-tab-selected-${
                primaryColor === 'rhyno' ? 'default' : 'dark'
              }`}
              className="category-button-videos category-button">
              {width <= 700 ? 'Video' : 'Videos Created'}
            </Tab>

            <Tab //////NFTs Created
              style={{
                backgroundColor: `${
                  primaryColor === 'rhyno' ? '#fafafa' : '#222021'
                }`,
                border: `1px solid ${
                  primaryColor === 'rhyno' ? 'var(--rhyno)' : '#4E4D4D'
                }`
              }}
              selectedClassName={`search-tab-selected-${
                primaryColor === 'rhyno' ? 'default' : 'dark'
              }`}
              className="category-button-videos category-button">
              NFTs Created
            </Tab>
          </TabList>
          {/* Search block */}
          <div className="bar-wrapper">
            <InputField
              getter={titleSearch}
              setter={setTitleSearch}
              placeholder={'Search...'}
              customCSS={{
                backgroundColor: `var(--${
                  primaryColor === 'charcoal'
                    ? `color-mix(in srgb, ${primaryColor}, #aaaaaa)`
                    : `rhyno-40`
                })`,
                color: `var(--${textColor})`,
                borderTopLeftRadius: '0',
                border: `${
                  primaryColor === 'charcoal'
                    ? `solid 1px color-mix(in srgb, ${primaryColor}, #888888)`
                    : 'solid 1px var(--rhyno)'
                } `
              }}
              customClass="form-control input-styled user-search"
            />
            <i className="fas-custom">
              <FontAwesomeIcon icon={faSearch} size="lg" />
            </i>
            <FilteringBlock
              primaryColor={primaryColor}
              setSortItem={setSortItem}
              sortItem={sortItem}
              isFilterShow={false}
            />
          </div>
          <TabPanel>
            <PersonalProfileMyNftTab
              filteredData={filteredData && filteredData}
              openModal={openModal}
              setSelectedData={setSelectedData}
              defaultImg={defaultImg}
              chainData={chainData}
              textColor={textColor}
              titleSearch={titleSearch}
            />
          </TabPanel>
          <TabPanel>
            <PersonalProfileMyVideoTab titleSearch={titleSearch} />
          </TabPanel>
          <TabPanel>
            <PersonalProfileFavoritesTab titleSearch={titleSearch} />
          </TabPanel>
          <TabPanel>
            <PersonalProfileMyCreated
              openModal={openModal}
              setSelectedData={setSelectedData}
              setIsCreatedTab={setIsCreatedTab}
              primaryColor={primaryColor}
              chainData={chainData}
              tabIndex={tabIndexItems}
            />
          </TabPanel>
        </Tabs>
      </div>
      {isOpenBlockchain ? (
        <ModalItem
          setIsOpenBlockchain={setIsOpenBlockchain}
          isOpenBlockchain={isOpenBlockchain}
          selectedData={selectedData}
          primaryColor={primaryColor}
          defaultImg={defaultImg}
          isCreatedTab={isCreatedTab}
          setIsCreatedTab={setIsCreatedTab}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserProfile;
