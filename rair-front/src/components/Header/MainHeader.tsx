//tools
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  faSearch,
  faTimes,
  faUserSecret
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { IMainHeader, TAxiosCollectionData } from './header.types';

import { SvgUserIcon } from '../../components/UserProfileSettings/SettingsIcons/SettingsIcons';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { getDataAllClear, getDataAllStart } from '../../ducks/search/actions';
import { TUsersInitialState } from '../../ducks/users/users.types';
import useComponentVisible from '../../hooks/useComponentVisible';
import useConnectUser from '../../hooks/useConnectUser';
//images
import { headerLogoBlack, headerLogoWhite } from '../../images';
import { rFetch } from '../../utils/rFetch';
import InputField from '../common/InputField';
import { TooltipBox } from '../common/Tooltip/TooltipBox';
import MainLogo from '../GroupLogos/MainLogo';
import ImageCustomForSearch from '../MockUpPage/utils/image/ImageCustomForSearch';
import PopUpNotification from '../UserProfileSettings/PopUpNotification/PopUpNotification';

import {
  TSearchDataProduct,
  TSearchDataTokens,
  TSearchDataUser,
  TSearchInitialState
} from './../../ducks/search/search.types';
//imports components
import UserProfileSettings from './../UserProfileSettings/UserProfileSettings';
import AdminPanel from './AdminPanel/AdminPanel';
import {
  HeaderContainer /*, SocialHeaderBox */
} from './HeaderItems/HeaderItems';
import TalkSalesComponent from './HeaderItems/TalkToSalesComponent/TalkSalesComponent';

//styles
import './Header.css';

const MainHeader: React.FC<IMainHeader> = ({
  goHome,
  creatorViewsDisabled,
  selectedChain,
  showAlert,
  isSplashPage,
  setTabIndexItems,
  isAboutPage,
  setTokenNumber,
  realChainId
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(true);
  const {
    primaryColor,
    headerLogo,
    primaryButtonColor,
    textColor,
    secondaryColor,
    iconColor
  } = useSelector<RootState, ColorStoreType>((store) => store.colorStore);
  const { connectUserData } = useConnectUser();
  const { dataAll, message } = useSelector<RootState, TSearchInitialState>(
    (store) => store.allInformationFromSearch
  );
  const { adminRights, superAdmin, loggedIn, loginProcess } = useSelector<
    RootState,
    TUsersInitialState
  >((store) => store.userStore);

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const hotdropsVar = import.meta.env.VITE_TESTNET;
  const [realDataNotification, setRealDataNotification] = useState([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const [textSearch, setTextSearch] = useState<string>('');
  const [adminPanel, setAdminPanel] = useState<boolean>(false);

  const goToExactlyContract = useCallback(
    async (addressId: string, collectionIndexInContract: string) => {
      if (dataAll) {
        const response = await axios.get<TAxiosCollectionData>(
          `/api/contracts/${addressId}`
        );
        const exactlyContractData = {
          blockchain: response.data.contract.blockchain,
          contractAddress: response.data.contract.contractAddress,
          indexInContract: collectionIndexInContract
        };
        navigate(
          `/collection/${exactlyContractData.blockchain}/${exactlyContractData.contractAddress}/${exactlyContractData.indexInContract}/0`
        );
        setTextSearch('');
        dispatch(getDataAllClear());
      }
    },
    [dataAll, dispatch, navigate]
  );

  const goToExactlyToken = useCallback(
    async (addressId: string, token: string) => {
      if (dataAll) {
        const response = await axios.get<TAxiosCollectionData>(
          `/api/contracts/${addressId}`
        );

        const exactlyTokenData = {
          blockchain: response.data.contract.blockchain,
          contractAddress: response.data.contract.contractAddress
        };

        navigate(
          `/tokens/${exactlyTokenData.blockchain}/${exactlyTokenData.contractAddress}/0/${token}`
        );
        setTextSearch('');
        dispatch(getDataAllClear());
      }
    },
    [dataAll, dispatch, navigate]
  );

  const goToExactlyUser = (userAddress) => {
    navigate(`/${userAddress}`);
    setTextSearch('');
  };

  const getNotifications = useCallback(
    async (pageNum?: number) => {
      if (currentUserAddress) {
        const result = await rFetch(
          `/api/notifications${pageNum ? `?pageNum=${Number(pageNum)}` : ''}`
        );

        if (result.success) {
          const sortedNotifications = result.notifications.sort((a, b) => {
            if (!a.read && b.read) return -1;
            if (a.read && !b.read) return 1;

            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            return dateB - dateA;
          }) 
          console.info(result.notifications, 'result.notifications')
          setRealDataNotification(sortedNotifications);
        }
      }
    },
    [currentUserAddress]
  );

  const getNotificationsCount = useCallback(async () => {
    if (currentUserAddress) {
      const result = await rFetch(`/api/notifications?onlyUnread=true`);
      if (result.success && result.totalCount >= 0) {
        setNotificationCount(result.totalCount);
      }
    }
  }, [currentUserAddress]);

  useEffect(() => {
    getNotificationsCount();
  }, [getNotificationsCount]);

  useEffect(() => {
    getNotifications(0);
  }, [currentUserAddress]);

  const Highlight = (props) => {
    const { filter, str } = props;
    if (!filter) return str;
    const regexp = new RegExp(
      filter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'),
      'ig'
    );
    const matchValue = str.match(regexp);

    if (matchValue) {
      return str
        .split(regexp)
        .map((s: string, index: number, array: string[]) => {
          if (index < array.length - 1) {
            const c = matchValue.shift();
            return (
              <React.Fragment key={index}>
                {s}
                <span className={'highlight'}>{c}</span>
              </React.Fragment>
            );
          }
          return s;
        });
    }
    return str;
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(e.target.value);
  };

  const handleClearText = () => {
    setTextSearch('');
  };

  useEffect(() => {
    if (textSearch.length > 0) {
      dispatch(getDataAllStart(textSearch));
    }
  }, [dispatch, textSearch]);

  return (
    <HeaderContainer
      hotdrops={hotdropsVar}
      className="col-12 header-master"
      primaryColor={primaryColor}
      showAlert={showAlert}
      isSplashPage={isSplashPage}
      selectedChain={selectedChain}
      realChainId={realChainId}
      secondaryColor={secondaryColor}
      ref={ref}>
      <div>
        <MainLogo
          goHome={goHome}
          headerLogoWhite={headerLogoWhite}
          headerLogoBlack={headerLogoBlack}
          headerLogo={headerLogo}
          primaryColor={primaryColor}
        />
      </div>
      <div
        className={`main-search ${isSplashPage ? 'hidden' : ''} ${
          hotdropsVar === 'true' ? 'hotdrops-header' : ''
        }`}>
        <InputField
          customCSS={{
            color: textColor,
            borderColor: textColor,
            backgroundColor: primaryColor
          }}
          type="text"
          placeholder="Search..."
          setter={handleChangeText}
          getter={textSearch}
          onClick={() => setIsComponentVisible(true)}
        />
        {isComponentVisible && (
          <div
            style={{
              background: `${
                primaryColor === '#dedede'
                  ? '#fff'
                  : `color-mix(in srgb, ${primaryColor}, #888888)`
              }`
            }}
            className={`search-holder-wrapper ${
              primaryColor === 'rhyno' ? 'rhyno' : ''
            }`}>
            <div>
              <div className="search-holder">
                {textSearch && (
                  <>
                    {dataAll && dataAll?.products.length > 0 ? (
                      <div className="data-find-wrapper">
                        <h5>Products</h5>
                        {dataAll?.products.map(
                          (item: TSearchDataProduct, index: number) => (
                            <div
                              key={Number(index) + Math.random()}
                              className="data-find">
                              <img
                                className="data-find-img"
                                src={item.cover}
                                alt={item.name}
                              />
                              <p
                                onClick={() => {
                                  setTokenNumber(undefined);
                                  goToExactlyContract(
                                    item.contract,
                                    item.collectionIndexInContract
                                  );
                                }}>
                                <Highlight
                                  filter={textSearch}
                                  str={item.name}
                                />
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                    {dataAll && dataAll?.tokens.length > 0 ? (
                      <div className="data-find-wrapper">
                        <h5>Tokens</h5>
                        {dataAll?.tokens.map(
                          (item: TSearchDataTokens, index: number) => (
                            <div
                              key={Number(index) + Math.random()}
                              className="data-find">
                              <ImageCustomForSearch item={item} />
                              <p
                                onClick={() => {
                                  setTokenNumber(undefined);
                                  goToExactlyToken(
                                    item.contract,
                                    item.uniqueIndexInContract
                                  );
                                }}>
                                <Highlight
                                  filter={textSearch}
                                  str={item.metadata.name}
                                />
                              </p>
                              <div className="desc-wrapper">
                                <p>
                                  <Highlight
                                    filter={textSearch}
                                    str={item.metadata.description}
                                  />
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                    {dataAll && dataAll?.users.length > 0 ? (
                      <div className="data-find-wrapper">
                        <h5>Users</h5>
                        {dataAll?.users.map(
                          (item: TSearchDataUser, index: number) => (
                            <div
                              key={Number(index) + Math.random()}
                              className="data-find"
                              onClick={() =>
                                goToExactlyUser(item.publicAddress)
                              }>
                              {item.avatar ? (
                                <img
                                  className="data-find-img"
                                  src={item.avatar}
                                  alt="user-photo"
                                />
                              ) : (
                                <div className="user-icon-svg-wrapper">
                                  <SvgUserIcon />
                                </div>
                              )}
                              <p>
                                <Highlight
                                  filter={textSearch}
                                  str={item.nickName}
                                />
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
                {textSearch !== '' && message === 'Nothing can found' ? (
                  <span className="data-nothing-find">No items found</span>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        )}
        {!isComponentVisible && null}
        {textSearch && textSearch.length > 0 && (
          <FontAwesomeIcon onClick={handleClearText} icon={faTimes} />
        )}
        <i
          className="fas-custom"
          style={{ marginTop: '-5px', marginLeft: '5px' }}>
          <FontAwesomeIcon
            icon={faSearch}
            size="lg"
            style={{
              color:
                import.meta.env.VITE_TESTNET === 'true'
                  ? `${iconColor === '#1486c5' ? '#F95631' : iconColor}`
                  : `${iconColor === '#1486c5' ? '#E882D5' : iconColor}`
            }}
            aria-hidden="true"
          />
        </i>
      </div>
      <div className="box-header-info">
        {!loggedIn && (
          <div>
            {isAboutPage ? null : (
              <button
                className="btn rair-button btn-connect-wallet"
                style={{
                  background: `${
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
                  }`,
                  color: textColor
                }}
                onClick={() => connectUserData()}>
                {loginProcess ? 'Please wait...' : 'Connect'}
              </button>
            )}
          </div>
        )}
        <div className="box-connect-btn">
          {adminRights && currentUserAddress && (
            <TooltipBox title="Admin Panel">
              <div
                onClick={() => setAdminPanel((prev) => !prev)}
                className={`admin-panel-btn ${superAdmin ? 'super' : ''}`}>
                <FontAwesomeIcon icon={faUserSecret} />
              </div>
            </TooltipBox>
          )}
          <UserProfileSettings
            adminAccess={adminRights}
            showAlert={showAlert}
            selectedChain={selectedChain}
            setTabIndexItems={setTabIndexItems}
            isSplashPage={isSplashPage}
          />
          <div className="social-media">
            {currentUserAddress && (
              <PopUpNotification
                setRealDataNotification={setRealDataNotification}
                notificationCount={notificationCount}
                getNotificationsCount={getNotificationsCount}
                getNotifications={getNotifications}
                realDataNotification={realDataNotification}
              />
            )}

            <AdminPanel
              creatorViewsDisabled={creatorViewsDisabled}
              adminPanel={adminPanel}
              setAdminPanel={setAdminPanel}
            />
          </div>
        </div>
        {hotdropsVar !== 'true' && (
          <TalkSalesComponent
            isAboutPage={isAboutPage}
            text={currentUserAddress ? 'Contact Us' : 'Support'}
          />
        )}
      </div>
    </HeaderContainer>
  );
};

export default memo(MainHeader);
