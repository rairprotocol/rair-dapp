import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rFetch } from '../../utils/rFetch';
import setDocumentTitle from '../../utils/setTitle';
import InputField from '../common/InputField';
import FilteringBlock from '../MockUpPage/FilteringBlock/FilteringBlock';
import ModalItem from '../MockUpPage/FilteringBlock/portal/ModalItem/ModalItem';
import './MyItems.css';
import { getTokenError } from '../../ducks/auth/actions';
import { IMyItems, TDiamondTokensType } from './nft.types';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { NavLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { PersonalProfileBackground } from './PersonalProfile/PersonalProfileBackground/PersonalProfileBackground';
import { PersonalProfileIcon } from './PersonalProfile/PersonalProfileIcon/PersonalProfileIcon';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { PersonalProfileMyNftTab } from './PersonalProfile/PersonalProfileMyNftTab/PersonalProfileMyNftTab';
import { PersonalProfileMyVideoTab } from './PersonalProfile/PersonalProfileMyVideoTab/PersonalProfileMyVideoTab';
import { PersonalProfileMyCreated } from './PersonalProfile/PersonalProfileMyCreated/PersonalProfileMyCreated';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TSortChoice } from '../MockUpPage/FilteringBlock/filteringBlock.types';
import { Breadcrumbs, Typography } from '@mui/material';
import chainData from '../../utils/blockchainData';
import PersonalProfileFavoritesTab from './PersonalProfile/PersonalProfileFavoritesTab/PersonalProfileFavoritesTab';

const MyItems: React.FC<IMyItems> = ({ userData, setIsSplashPage }) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const defaultImg =
    'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW';

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
  const [tabIndex, setTabIndex] = useState(0);

  const getMyNft = useCallback(async () => {
    const response = await rFetch('/api/nft');

    if (response.success) {
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
    <Typography
      key="3"
      color={`${primaryColor === 'rhyno' ? 'black' : 'white'}`}>
      Personal profile
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
    setDocumentTitle('My Items');
    window.scrollTo(0, 0);
    setIsSplashPage(false);
  }, [setIsSplashPage]);

  return (
    <div className="my-items-wrapper">
      <div className="my-items-breadcrumbs-wrapper">
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
      <div className="my-items-header-wrapper">
        <PersonalProfileIcon userData={userData} />
        {/* <div onClick={() => navigate(-1)} className="my-items-title-wrapper">
          <i className="fas fa-arrow-left fa-arrow-custom"></i>
          <h1 className="my-items-title">My Items</h1>
        </div> */}
        <>
          <Tabs
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}>
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
                {width <= 700 ? 'NFT' : 'My NFTs'}
              </Tab>
              <Tab
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
                {width <= 700 ? 'Video' : 'My Videos'}
              </Tab>
              <Tab
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
                {width <= 700 ? <i className="fas fa-heart" /> : 'My favorites'}
              </Tab>
              <Tab
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
                Created
              </Tab>
            </TabList>
            {/* Search block */}
            <div className="my-items-bar-wrapper">
              <InputField
                getter={titleSearch}
                setter={setTitleSearch}
                placeholder={'Search...'}
                customCSS={{
                  backgroundColor: `var(--${
                    primaryColor === 'charcoal' ? 'charcoal-90' : `rhyno-40`
                  })`,
                  color: `var(--${textColor})`,
                  borderTopLeftRadius: '0',
                  border: `${
                    primaryColor === 'charcoal'
                      ? 'solid 1px var(--charcoal-80)'
                      : 'solid 1px var(--rhyno)'
                  } `
                }}
                customClass="form-control input-styled my-items-search"
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
            <TabPanel>
              <PersonalProfileMyNftTab
                filteredData={filteredData && filteredData}
                openModal={openModal}
                setSelectedData={setSelectedData}
                defaultImg={defaultImg}
                primaryColor={primaryColor}
                chainData={chainData}
                textColor={textColor}
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
                tabIndex={tabIndex}
              />
            </TabPanel>
          </Tabs>
        </>
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
      {/* <div className="container-diamond-items">
        <h3>Diamond Items <i className='fas h5 fa-gem' /></h3>
        <MyDiamondItems {...{ openModal, setSelectedData }} /> 
      </div>*/}
    </div>
  );
};

export default MyItems;
