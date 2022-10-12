//tools
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// import { NavLink } from 'react-router-dom';
// import Popup from 'reactjs-popup';
import { IMainHeader, TAxiosCollectionData } from './header.types';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { getDataAllClear, getDataAllStart } from '../../ducks/search/actions';
import { TUsersInitialState } from '../../ducks/users/users.types';
import { DiscordIcon, TwitterIcon } from '../../images';
//images
import { headerLogoBlack, headerLogoWhite } from '../../images';
import { SocialBox } from '../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { OnboardingButton } from '../common/OnboardingButton/OnboardingButton';
import MainLogo from '../GroupLogos/MainLogo';
import ImageCustomForSearch from '../MockUpPage/utils/image/ImageCustomForSearch';

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
  loginDone,
  startedLogin,
  renderBtnConnect,
  connectUserData,
  setLoginDone,
  userData,
  creatorViewsDisabled,
  selectedChain,
  showAlert,
  isSplashPage,
  setTabIndexItems
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { primaryColor, headerLogo } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const { dataAll, message } = useSelector<RootState, TSearchInitialState>(
    (store) => store.allInformationFromSearch
  );
  const { adminRights } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );
  const { currentUserAddress, programmaticProvider } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);

  const [textSearch, setTextSearch] = useState<string>('');
  const [adminPanel, setAdminPanel] = useState<boolean>(false);

  const goToExactlyContract = useCallback(
    async (addressId: string, collectionIndexInContract: string) => {
      if (dataAll) {
        const response = await axios.get<TAxiosCollectionData>(
          `/api/contracts/singleContract/${addressId}`
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
          `/api/contracts/singleContract/${addressId}`
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

  const Highlight = (props) => {
    const { filter, str } = props;
    if (!filter) return str;

    const regexp = new RegExp(filter, 'ig');
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
      className="col-12 header-master"
      primaryColor={primaryColor}
      showAlert={showAlert}
      isSplashPage={isSplashPage}
      selectedChain={selectedChain}>
      <div>
        <MainLogo
          goHome={goHome}
          headerLogoWhite={headerLogoWhite}
          headerLogoBlack={headerLogoBlack}
          headerLogo={headerLogo}
          primaryColor={primaryColor}
        />
      </div>
      <div className={`main-search ${isSplashPage ? 'hidden' : ''}`}>
        <input
          className={primaryColor === 'rhyno' ? 'rhyno' : 'input-search-black'}
          type="text"
          placeholder="Search the rairverse..."
          onChange={handleChangeText}
          value={textSearch}
        />
        <div
          className={`search-holder-wrapper ${
            primaryColor === 'rhyno' ? 'rhyno' : ''
          }`}>
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
                            onClick={() =>
                              goToExactlyContract(
                                item.contract,
                                item.collectionIndexInContract
                              )
                            }>
                            <Highlight filter={textSearch} str={item.name} />
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
                            onClick={() =>
                              goToExactlyToken(
                                item.contract,
                                item.uniqueIndexInContract
                              )
                            }>
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
                          className="data-find">
                          <img
                            className="data-find-img"
                            src={item.avatar ? item.avatar : ''}
                            alt="user-photo"
                          />
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
            )}{' '}
            {textSearch !== '' && message === 'Nothing' ? (
              <span className="data-nothing-find">No items found</span>
            ) : (
              <></>
            )}
          </div>
        </div>
        {textSearch && textSearch.length > 0 && (
          <i
            onClick={handleClearText}
            className="fas fa-times"
            aria-hidden="true"></i>
        )}
        <i className="fas fa-search" aria-hidden="true"></i>
      </div>
      <div className="box-header-info">
        {!loginDone && (
          <div>
            {renderBtnConnect ? (
              <OnboardingButton />
            ) : (
              <button
                disabled={
                  !window.ethereum && !programmaticProvider && !startedLogin
                }
                className={`btn btn-${primaryColor} btn-connect-wallet`}
                onClick={connectUserData}>
                {startedLogin ? 'Please wait...' : 'Connect'}
              </button>
            )}
          </div>
        )}
        <div className="box-connect-btn">
          {adminRights && currentUserAddress && (
            <div
              onClick={() => setAdminPanel((prev) => !prev)}
              className="admin-panel-btn">
              <i className="fa fa-user-secret" aria-hidden="true" />
            </div>
          )}
          <UserProfileSettings
            userData={userData}
            adminAccess={adminRights}
            currentUserAddress={currentUserAddress}
            loginDone={loginDone}
            setLoginDone={setLoginDone}
            showAlert={showAlert}
            selectedChain={selectedChain}
            setTabIndexItems={setTabIndexItems}
          />
          <div className="social-media">
            <SocialBox hoverColor={'#7289d9'} primaryColor={primaryColor}>
              <a
                href="https://discord.gg/pSTbf2yz7V"
                target={'_blank'}
                rel="noreferrer">
                <DiscordIcon primaryColor={primaryColor} color={'#fff'} />
              </a>
            </SocialBox>
            <SocialBox
              marginRight={'17px'}
              marginLeft={'17px'}
              hoverColor={'#1DA1F2'}
              primaryColor={primaryColor}>
              <a
                href="https://twitter.com/rairtech"
                target={'_blank'}
                rel="noreferrer">
                <TwitterIcon primaryColor={primaryColor} color={'#fff'} />
              </a>
            </SocialBox>
            <AdminPanel
              loginDone={loginDone}
              creatorViewsDisabled={creatorViewsDisabled}
              adminPanel={adminPanel}
              setAdminPanel={setAdminPanel}
            />
          </div>
        </div>
        <TalkSalesComponent text={'Talk to sales'} />
      </div>
    </HeaderContainer>
  );
};

export default MainHeader;
