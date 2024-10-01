import { FC, Fragment, memo, useCallback, useEffect, useState } from 'react';
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
import useComponentVisible from '../../hooks/useComponentVisible';
import useConnectUser from '../../hooks/useConnectUser';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { dataStatuses } from '../../redux/commonTypes';
import { clearResults, startSearch } from '../../redux/searchbarSlice';
import { fetchNotifications } from '../../redux/notificationsSlice';
import InputField from '../common/InputField';
import { TooltipBox } from '../common/Tooltip/TooltipBox';
import MainLogo from '../GroupLogos/MainLogo';
import ImageCustomForSearch from '../MockUpPage/utils/image/ImageCustomForSearch';
import PopUpNotification from '../UserProfileSettings/PopUpNotification/PopUpNotification';

//imports components
import UserProfileSettings from './../UserProfileSettings/UserProfileSettings';
import AdminPanel from './AdminPanel/AdminPanel';
import {
  HeaderContainer /*, SocialHeaderBox */
} from './HeaderItems/HeaderItems';
import TalkSalesComponent from './HeaderItems/TalkToSalesComponent/TalkSalesComponent';

//styles
import './Header.css';

const MainHeader: FC<IMainHeader> = ({
  goHome,
  creatorViewsDisabled,
  showAlert,
  isSplashPage,
  setTabIndexItems,
  isAboutPage,
  setTokenNumber,
  realChainId
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(true);
  const {
    primaryColor,
    primaryButtonColor,
    textColor,
    secondaryColor,
    iconColor,
    isDarkMode
  } = useAppSelector((store) => store.colors);
  const { connectUserData } = useConnectUser();
  const { searchResults } = useAppSelector((store) => store.searchbar);
  const { adminRights, superAdmin, isLoggedIn, loginStatus } = useAppSelector(
    (store) => store.user
  );

  const { totalCount: notificationCount, notifications } = useAppSelector(store => store.notifications);

  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const [textSearch, setTextSearch] = useState<string>('');
  const [adminPanel, setAdminPanel] = useState<boolean>(false);

  const goToExactlyContract = useCallback(
    async (addressId: string, collectionIndexInContract: string) => {
      if (searchResults) {
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
        dispatch(clearResults());
      }
    },
    [searchResults, dispatch, navigate]
  );

  const goToExactlyToken = useCallback(
    async (addressId: string, token: string) => {
      if (searchResults) {
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
        dispatch(clearResults());
      }
    },
    [searchResults, dispatch, navigate]
  );

  const goToExactlyUser = (userAddress) => {
    navigate(`/${userAddress}`);
    setTextSearch('');
  };

  useEffect(() => {
    if(currentUserAddress && isLoggedIn) {
      dispatch(fetchNotifications(0));
    }
  }, [currentUserAddress, isLoggedIn]);

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
              <Fragment key={index}>
                {s}
                <span className={'highlight'}>{c}</span>
              </Fragment>
            );
          }
          return s;
        });
    }
    return str;
  };

  const handleClearText = () => {
    setTextSearch('');
  };

  useEffect(() => {
    if (textSearch.length > 0) {
      dispatch(startSearch({ searchTerm: textSearch }));
    }
  }, [dispatch, textSearch]);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [])

  return (
    <HeaderContainer
      hotdrops={hotdropsVar}
      className="col-12 header-master"
      isDarkMode={isDarkMode}
      showAlert={showAlert}
      isSplashPage={isSplashPage}
      realChainId={realChainId}
      secondaryColor={secondaryColor}
      ref={ref}>
      <div>
        <MainLogo goHome={goHome} />
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
          setter={setTextSearch}
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
                    {searchResults &&
                    searchResults?.products?.length &&
                    searchResults?.products?.length > 0 ? (
                      <div className="data-find-wrapper">
                        <h5>Products</h5>
                        {searchResults?.products.map((item, index) => (
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
                              <Highlight filter={textSearch} str={item.name} />
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <></>
                    )}
                    {searchResults &&
                    searchResults?.tokens?.length &&
                    searchResults?.tokens?.length > 0 ? (
                      <div className="data-find-wrapper">
                        <h5>Tokens</h5>
                        {searchResults?.tokens?.map((item, index) => (
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
                        ))}
                      </div>
                    ) : (
                      <></>
                    )}
                    {searchResults &&
                    searchResults?.users?.length &&
                    searchResults?.users?.length > 0 ? (
                      <div className="data-find-wrapper">
                        <h5>Users</h5>
                        {searchResults?.users?.map((item, index) => (
                          <div
                            key={Number(index) + Math.random()}
                            className="data-find"
                            onClick={() => goToExactlyUser(item.publicAddress)}>
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
                        ))}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
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
        {!isLoggedIn && (
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
                {loginStatus === dataStatuses.Loading
                  ? 'Please wait...'
                  : 'Connect'}
              </button>
            )}
          </div>
        )}
        <div className="box-connect-btn">
          {(adminRights || superAdmin) && currentUserAddress && (
            <TooltipBox title="Admin Panel">
              <div
                onClick={() => setAdminPanel((prev) => !prev)}
                className={`admin-panel-btn ${superAdmin ? 'super' : ''}`}>
                <FontAwesomeIcon icon={faUserSecret} />
              </div>
            </TooltipBox>
          )}
          <UserProfileSettings
            showAlert={showAlert}
            setTabIndexItems={setTabIndexItems}
          />
          <div className="social-media">
            {currentUserAddress && (
              <PopUpNotification
                notificationCount={notificationCount}
                realDataNotification={notifications}
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
