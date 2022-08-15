//@ts-nocheck
import { memo, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
// import cl from './created.module.css';

const PersonalProfileMyCreatedComponent = ({
  openModal,
  setSelectedData,
  primaryColor,
  chainData
  // textColor
}) => {
  const defaultImg =
    'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW';
  const [myContracts, setMyContracts] = useState();
  const [myProducts, setMyProducts] = useState();

  const getMyContracts = useCallback(async () => {
    const response = await axios.get('/api/contracts', {
      method: 'GET',
      headers: {
        'x-rair-token': localStorage.token
      }
    });

    if (response.data.success) {
      setMyContracts(response.data.contracts);
    } else if (
      response?.message === 'jwt expired' ||
      response?.message === 'jwt malformed'
    ) {
      localStorage.removeItem('token');
    } else {
      console.info(response?.message);
    }
  }, []);

  const getMyProducts = useCallback(async () => {
    if (myContracts && myContracts.length) {
      const allInOne = [];

      for await (const oneContract of myContracts) {
        const response = await axios.get(
          `/api/nft/network/${oneContract.blockchain}/${oneContract.contractAddress}/0`
        );
        allInOne.push({
          ...response.data.result.tokens
        });
        setMyProducts(allInOne);
      }
    }
  }, [myContracts]);

  useEffect(() => {
    getMyContracts();
  }, [getMyContracts]);

  useEffect(() => {
    getMyProducts();
  }, [getMyProducts]);

  return (
    <div
      className="wrapper
  ">
      <div className="gen">
        <div className="my-items-product-wrapper row">
          {myProducts && myProducts.length > 0 ? (
            myProducts.map((item, index) => {
              return Object.values(item).map((op) => {
                return (
                  <div
                    onClick={() => {
                      openModal();
                      setSelectedData(op);
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
                                  op?.blockchain
                                    ? `${chainData[op?.blockchain]?.image}`
                                    : ''
                                }
                                alt=""
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
          ) : (
            <p>you do not created, yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const PersonalProfileMyCreated = memo(PersonalProfileMyCreatedComponent);
