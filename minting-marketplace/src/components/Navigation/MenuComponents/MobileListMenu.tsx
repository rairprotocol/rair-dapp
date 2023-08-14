import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';

import MobileNavigationList from './MobileNavigationList';

import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import {
  getDataAllClear,
  getDataAllStart
} from '../../../ducks/search/actions';
import {
  TSearchDataProduct,
  TSearchDataTokens,
  TSearchDataUser,
  TSearchInitialState
} from '../../../ducks/search/search.types';
import useComponentVisible from '../../../hooks/useComponentVisible';
import { DiscordIcon, TelegramIcon, TwitterIcon } from '../../../images';
import { SocialBox } from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import {
  CommunityBlock,
  CommunityBoxFooter
} from '../../Footer/FooterItems/FooterItems';
import { TAxiosCollectionData } from '../../Header/header.types';
import ImageCustomForSearch from '../../MockUpPage/utils/image/ImageCustomForSearch';

import { List, SearchInputMobile } from './../NavigationItems/NavigationItems';

interface IMobileListMenu {
  click: boolean;
  messageAlert: string | null;
  activeSearch: boolean;
  primaryColor: ColorChoice;
  setMessageAlert;
  toggleMenu: (otherPage?: string | undefined) => void;
  setTabIndexItems: (arg: number) => void;
  isSplashPage: boolean;
}

const MobileListMenu: React.FC<IMobileListMenu> = ({
  primaryColor,
  click,
  activeSearch,
  toggleMenu,
  messageAlert,
  setMessageAlert,
  setTabIndexItems,
  isSplashPage
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { dataAll, message } = useSelector<RootState, TSearchInitialState>(
    (store) => store.allInformationFromSearch
  );
  const hotdropsVar = process.env.REACT_APP_HOTDROPS;

  const [textSearch, setTextSearch] = useState<string>('');

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

  const goToExactlyUser = (userAddress) => {
    navigate(`/${userAddress}`);
    setTextSearch('');
  };

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

  useEffect(() => {
    if (currentUserAddress) {
      dispatch({ type: 'GET_USER_START', publicAddress: currentUserAddress });
    }
  }, [currentUserAddress, dispatch]);

  return (
    <List hotdrops={hotdropsVar} primaryColor={primaryColor} click={click}>
      <div>
        {activeSearch && (
          <>
            <SearchInputMobile
              hotdrops={hotdropsVar}
              primaryColor={primaryColor}>
              <i className="fas fa-search" aria-hidden="true"></i>
              {process.env.REACT_APP_HOTDROPS === 'true' ? (
                <input
                  className={
                    primaryColor === 'rhyno' ? 'rhyno' : 'input-search-black'
                  }
                  type="text"
                  onChange={handleChangeText}
                  value={textSearch}
                  placeholder="Search"
                />
              ) : (
                <input
                  className={
                    primaryColor === 'rhyno' ? 'rhyno' : 'input-search-black'
                  }
                  type="text"
                  onChange={handleChangeText}
                  value={textSearch}
                  placeholder="Search the rairverse..."
                />
              )}
            </SearchInputMobile>
            <div>
              <div
                className={`search-holder-wrapper ${
                  primaryColor === 'rhyno' ? 'rhyno' : ''
                } mobile`}>
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
                                      // setTokenNumber(undefined);
                                      toggleMenu();
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
                                      // setTokenNumber(undefined);
                                      toggleMenu();
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
                                  onClick={() => {
                                    toggleMenu();
                                    goToExactlyUser(item.publicAddress);
                                  }}>
                                  {item.avatar ? (
                                    <img
                                      className="data-find-img"
                                      src={item.avatar}
                                      alt="user-photo"
                                    />
                                  ) : (
                                    <div className="user-icon-svg-wrapper">
                                      {/* <SvgUserIcon /> */}
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
            </div>
          </>
        )}
        {!activeSearch && (
          <MobileNavigationList
            click={click}
            messageAlert={messageAlert}
            setMessageAlert={setMessageAlert}
            primaryColor={primaryColor}
            toggleMenu={toggleMenu}
            currentUserAddress={currentUserAddress}
            setTabIndexItems={setTabIndexItems}
            isSplashPage={isSplashPage}
          />
        )}
      </div>
      {/* <CommunityBlock primaryColor={primaryColor}>
        <div className="community-text">Join our community</div>
        <CommunityBoxFooter className="header-mobile-community">
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
          <SocialBox hoverColor={'#229ED9'} primaryColor={primaryColor}>
            <TelegramIcon primaryColor={primaryColor} color={'#fff'} />
          </SocialBox>
        </CommunityBoxFooter>
      </CommunityBlock> */}
    </List>
  );
};

export default MobileListMenu;
