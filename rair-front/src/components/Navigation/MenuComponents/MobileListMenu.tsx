import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import MobileNavigationList from './MobileNavigationList';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
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
import { TAxiosCollectionData } from '../../Header/header.types';
import ImageCustomForSearch from '../../MockUpPage/utils/image/ImageCustomForSearch';

import { List, SearchInputMobile } from './../NavigationItems/NavigationItems';

interface IMobileListMenu {
  click: boolean;
  messageAlert: string | null;
  activeSearch: boolean;
  primaryColor: string;
  setMessageAlert;
  toggleMenu: (otherPage?: string | undefined) => void;
  setTabIndexItems: (arg: number) => void;
  isSplashPage: boolean;
  secondaryColor?: string;
}

const MobileListMenu: React.FC<IMobileListMenu> = ({
  primaryColor,
  click,
  activeSearch,
  toggleMenu,
  messageAlert,
  setMessageAlert,
  setTabIndexItems,
  isSplashPage,
  secondaryColor
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { dataAll, message } = useSelector<RootState, TSearchInitialState>(
    (store) => store.allInformationFromSearch
  );
  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const { iconColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const [textSearch, setTextSearch] = useState<string>('');

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
    <List
      secondaryColor={secondaryColor}
      hotdrops={hotdropsVar}
      primaryColor={primaryColor}
      click={click}>
      <div>
        {activeSearch && (
          <>
            <SearchInputMobile
              hotdrops={hotdropsVar}
              primaryColor={primaryColor}>
              <FontAwesomeIcon
                style={{
                  color:
                    import.meta.env.VITE_TESTNET === 'true'
                      ? `${iconColor === '#1486c5' ? '#F95631' : iconColor}`
                      : `${iconColor === '#1486c5' ? '#E882D5' : iconColor}`
                }}
                icon={faSearch}
              />

              {import.meta.env.VITE_TESTNET === 'true' ? (
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
                  placeholder="Search..."
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
    </List>
  );
};

export default MobileListMenu;
