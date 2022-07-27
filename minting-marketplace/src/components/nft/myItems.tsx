import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rFetch } from '../../utils/rFetch';
import { useNavigate } from 'react-router-dom';
import setDocumentTitle from '../../utils/setTitle';
import InputField from '../common/InputField';
import FilteringBlock from '../MockUpPage/FilteringBlock/FilteringBlock';
import ModalItem from '../MockUpPage/FilteringBlock/portal/ModalItem/ModalItem';
import chainData from '../../utils/blockchainData';
import './MyItems.css';
import { getTokenError } from '../../ducks/auth/actions';
import {
  IMyItems,
  TMyDiamondItemsToken,
  TDiamondTokensType
} from './nft.types';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';

const MyItems: React.FC<IMyItems> = ({ setIsSplashPage }) => {
  const dispatch = useDispatch();
  const defaultImg =
    'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW';

  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (state) => state.colorStore
  );
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<TDiamondTokensType[]>([]);
  const [selectedData, setSelectedData] = useState<
    TDiamondTokensType | TMyDiamondItemsToken
  >();
  const [titleSearch, setTitleSearch] = useState<string>('');
  const [sortItem, setSortItem] = useState<string>('');
  const [isOpenBlockchain, setIsOpenBlockchain] = useState<boolean>(false);
  const fetchData = useCallback(async () => {
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setDocumentTitle('My Items');
    window.scrollTo(0, 0);
    setIsSplashPage(false);
  }, [setIsSplashPage]);

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

  return (
    <div className="my-items-wrapper">
      <div className="my-items-header-wrapper">
        <div onClick={() => navigate(-1)} className="my-items-title-wrapper">
          <i className="fas fa-arrow-left fa-arrow-custom"></i>
          <h1 className="my-items-title">My Items</h1>
        </div>
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
              border: `${
                primaryColor === 'charcoal'
                  ? 'solid 1px var(--charcoal-80)'
                  : 'solid 1px var(--rhyno)'
              } `
            }}
            customClass="form-control input-styled my-items-search"
          />
          <i className="fas fa-search fa-lg fas-custom" aria-hidden="true"></i>
          <FilteringBlock
            primaryColor={primaryColor}
            setSortItem={setSortItem}
            sortItem={sortItem}
            isFilterShow={false}
          />
        </div>
      </div>
      <div className="my-items-product-wrapper">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            return (
              <div
                onClick={() => {
                  openModal();
                  setSelectedData(item);
                }}
                key={index}
                className="my-item-element"
                style={{
                  backgroundImage: `url(${item.metadata.image || defaultImg})`,
                  backgroundColor: `var(--${primaryColor}-transparent)`
                }}>
                <div className="bg-my-items">
                  <div className="my-items-description-wrapper my-items-pic-description-wrapper">
                    <div
                      className="container-blue-description"
                      style={{ color: '#fff' }}>
                      <span className="description-title">
                        {item.metadata ? (
                          <>
                            <span>{item.title}</span>
                          </>
                        ) : (
                          <b> No metadata available </b>
                        )}
                        <br />
                      </span>
                      <div className="container-blockchain-info">
                        <small className="description">
                          {item.contract.slice(0, 5) +
                            '....' +
                            item.contract.slice(item.contract.length - 4)}
                        </small>
                        {/*currently on my items view if you cant buy item cos
                        you already bought it no need to show blockchain
                        currency cos item dont have price.*/}
                        {/* <div className="description-small" style={{}}>
                          <img
                            className="my-items-blockchain-img"
                            src={
                              item.blockchain
                                ? `${chainData[item?.blockchain]?.image}`
                                : ''
                            }
                            alt=""
                          />
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: textColor, fontSize: '20px' }}>
            There is no such item with that name
          </p>
        )}
      </div>

      {isOpenBlockchain ? (
        <ModalItem
          setIsOpenBlockchain={setIsOpenBlockchain}
          isOpenBlockchain={isOpenBlockchain}
          selectedData={selectedData}
          primaryColor={primaryColor}
          defaultImg={defaultImg}
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
