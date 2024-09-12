//@ts-nocheck
import { memo, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useStateIfMounted } from 'use-state-if-mounted';

import useServerSettings from '../../../../hooks/useServerSettings';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';

const PersonalProfileMyCreatedComponent = ({
  openModal,
  setSelectedData,
  primaryColor,
  setIsCreatedTab,
  tabIndex
}) => {
  const defaultImg = `${
    import.meta.env.VITE_IPFS_GATEWAY
  }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`;
  const [myContracts, setMyContracts] = useState();
  const [myProducts, setMyProducts] = useStateIfMounted();
  const [load, setLoad] = useState(true);
  const { width } = useWindowDimensions();

  const { getBlockchainData } = useServerSettings();

  const getMyContracts = useCallback(async () => {
    const response = await axios.get('/api/contracts/factoryList');

    if (response.data.success) {
      setLoad(false);
      setMyContracts(response.data.contracts);
    } else {
      console.error(response?.message);
    }
  }, []);

  const getMyProducts = useCallback(async () => {
    if (myContracts && myContracts.length) {
      const allInOne = [];
      for await (const oneContract of myContracts) {
        // const response = await axios.get(
        //   `/api/nft/network/${oneContract.blockchain}/${oneContract.contractAddress}/0`
        // );
        axios
          .get(
            `/api/nft/network/${oneContract.blockchain}/${oneContract.contractAddress}/0`
          )
          .then((response) => {
            allInOne.push({
              ...response.data.result.tokens,
              blc: oneContract.blockchain,
              title: oneContract.title
            });
            setMyProducts(allInOne);
          });
      }
    }
  }, [myContracts, setMyProducts]);

  // useEffect(() => {
  //   getMyContracts();
  // }, [getMyContracts]);

  useEffect(() => {
    getMyProducts();
  }, [getMyProducts]);

  useEffect(() => {
    if (tabIndex === 3) {
      getMyContracts();
    }
  }, [getMyContracts, tabIndex]);

  return (
    <div className="wrapper">
      <div className="gen">
        <div
          className={`my-items-product-wrapper ${
            width >= 1250 && width <= 1400 && 'row'
          }`}>
          {myProducts && myProducts.length > 0 ? (
            myProducts.map((item, index) => {
              return Object.values(item).map((op) => {
                return (
                  <div
                    onClick={() => {
                      setIsCreatedTab(true);
                      openModal();
                      setSelectedData({
                        ...op,
                        blockchain: item.blc,
                        title: item.title
                      });
                    }}
                    key={Math.random() + index}
                    className="m-1 my-1 col-2 my-item-element"
                    style={{
                      backgroundImage: `url(${
                        op?.metadata?.image || defaultImg
                      })`,
                      backgroundColor: `var(--${primaryColor}-transparent)`
                    }}>
                    <div className="w-100 bg-my-items">
                      <div className="col my-items-description-wrapper my-items-pic-description-wrapper">
                        <div
                          className="container-blue-description"
                          style={{ color: '#fff' }}>
                          <span className="description-title">
                            {op?.metadata ? (
                              <>
                                <span>{op?.metadata?.name}</span>
                              </>
                            ) : (
                              <b> No metadata available </b>
                            )}
                            <br />
                          </span>
                          <div className="container-blockchain-info">
                            <small className="description">
                              {op?.contract?.slice(0, 5) +
                                '....' +
                                op?.contract?.slice(op.contract.length - 4)}
                            </small>
                            <div className="description-small" style={{}}>
                              <img
                                className="my-items-blockchain-img"
                                src={
                                  item?.blc
                                    ? `${getBlockchainData(item?.blc)?.image}`
                                    : ''
                                }
                                alt="Blockchain network"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })
          ) : load ? (
            <div className="loader-wrapper">
              <div className="load" />
            </div>
          ) : (
            <h1>You do not created, yet</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export const PersonalProfileMyCreated = memo(PersonalProfileMyCreatedComponent);
