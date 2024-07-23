//@ts-nocheck
//unused-component
import React, { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel
} from 'react-accessible-accordion';
import Carousel from 'react-multi-carousel';
import { useNavigate, useParams } from 'react-router-dom';

import { rFetch } from '../../../../utils/rFetch';
import ItemRank from '../../SelectBox/ItemRank';
import SelectBox from '../../SelectBox/SelectBox';
import OfferItem from '../OfferItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const NftDataPage = ({ primaryColor, textColor }) => {
  const navigate = useNavigate();
  const params = useParams();
  const { adminToken, contract, product, token, offer } = params;

  const [data, setData] = useState();
  const [tokenData, _setTokenData] = useState([]);
  const setTokenData = useCallback(
    (tokenDataToSet) => {
      _setTokenData(tokenDataToSet);
    },
    [_setTokenData]
  );
  const [offerPrice, setOfferPrice] = useState([]);
  const [selectedToken, setSelectedToken] = useState(token);
  // const [allProducts, setAllProducts] = useState([]);

  //   const [contractAddress, setContractAddress] = useState();

  // console.log(params, "params");

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      paddingLeft: '2rem',
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const handleClickToken = () => {
    navigate(`/${adminToken}/${contract}/${product}/${offer}/${selectedToken}`);
  };

  function randomInteger(min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  function percentToRGB(percent) {
    if (percent) {
      if (percent < 15) {
        return '#95F619';
      } else if (15 <= percent && percent < 35) {
        return '#F6ED19';
      } else {
        return '#F63419';
      }
    }
    // if (percent === 100) {
    //   percent = 99;
    // }
    // let r, g, b;

    // if (percent < 50) {
    //   // green to yellow
    //   r = Math.floor(255 * (percent / 50));
    //   g = 255;
    // } else {
    //   // yellow to red
    //   r = 255;
    //   g = Math.floor(255 * ((50 - (percent % 50)) / 50));
    // }
    // b = 0;

    // return "rgb(" + r + "," + g + "," + b + ")";
  }
  function toUpper(string) {
    if (string) {
      return string[0].toUpperCase() + string.slice(1);
    }
  }

  function arrayMin(arr) {
    let len = arr.length,
      min = Infinity;
    while (len--) {
      if (arr[len] < min) {
        min = arr[len];
      }
    }
    return min;
  }

  function arrayMax(arr) {
    let len = arr.length,
      max = -Infinity;
    while (len--) {
      if (arr[len] > max) {
        max = arr[len];
      }
    }
    return max;
  }

  const minPrice = arrayMin(offerPrice);
  const maxPrice = arrayMax(offerPrice);

  const getData = useCallback(async () => {
    if (adminToken && contract && product) {
      const { success, result } = await rFetch(
        `/api/${adminToken}/${contract}/${product}`
      );

      const tokenMapping = {};

      if (success) {
        result.tokens.forEach((item) => {
          tokenMapping[item.token] = item;
        });
      }

      setTokenData(tokenMapping);

      setData(response.result);

      setOfferPrice(
        response.result.product.products.offers.map((p) => p.price)
      );

      // setContractAddress(response.result.product.contractAddress)
      //   return response.result;
    } else return null;
  }, [adminToken, contract, product, setTokenData]);

  const getAllProduct = useCallback(async () => {
    const { success, result } = await rFetch(`/api/nft/${contract}/${product}`);

    const tokenMapping = {};

    if (success) {
      result.tokens.forEach((item) => {
        tokenMapping[item.token] = item;
      });
      setTokenData(tokenMapping);
    }

    setData(responseAllProduct);
    setSelectedToken(0);
    // if (!Object.keys(params).length)
    //   setSelected(responseAllProduct.result[0].metadata);
  }, [product, contract, setTokenData]);

  useEffect(() => {
    getData();
    getAllProduct();
  }, [getData, getAllProduct]);

  if (!tokenData[selectedToken]) {
    return 'No token, sorry, go away:(';
  }
  if (!data?.tokens) {
    return 'No data.tokens, sorry :(';
  }

  return (
    <div>
      {tokenData && data && (
        <div>
          {/* <button
        style={{
          float: "right",
          position: "relative",
          bottom: "6rem",
          border: "none",
          background: "transparent",
          color: "mediumpurple",
          transform: "scale(1.5)",
        }}
        // onClick={closeModal}
      >
        &#215;
      </button> */}
          <div
            style={{
              maxWidth: '1600px',
              margin: 'auto',
              backgroundColor: primaryColor,
              borderRadius: '16px',
              padding: '24px 0'
            }}>
            <div className="ntf-header">
              <h2
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '40px',
                  fontStyle: 'normal',
                  fontWeight: '700',
                  lineHeight: '28px',
                  letterSpacing: '0px',
                  textAlign: 'left',
                  marginBottom: '3rem',
                  marginTop: '1rem',
                  marginLeft: '3px'
                }}>
                {tokenData[selectedToken]?.metadata.name}
              </h2>
              <div className="btn-share">
                <button>Share</button>
              </div>
            </div>
            <div
              //   onClick={onClick}
              style={{
                margin: 'auto',
                backgroundImage: `url(${tokenData[selectedToken]?.metadata?.image})`,
                width: '604px',
                height: '45rem',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }}></div>
            <div
              className="main-tab"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                padding: '2rem',
                alignItems: 'center'
              }}>
              <div>
                <span>Price range</span>
                <div
                  style={{
                    borderRadius: '16px',
                    padding: '10px',
                    width: '228px',
                    height: '48px',
                    backgroundColor: '#383637',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <img
                    style={{ width: '24px', transform: 'scale(1.2)' }}
                    // src={`${chainData[data?.product.blockchain]?.image}`}
                    alt="NFT powered by Rair Tech"
                  />
                  <span
                    style={{
                      paddingLeft: '9px',
                      marginRight: '3rem'
                    }}>
                    {minPrice} – {maxPrice} ETH
                  </span>
                  <span
                    style={{
                      color: '#E882D5'
                    }}>
                    ERC
                  </span>
                </div>
              </div>
              <div>
                <span>Item rank</span>
                <div>
                  <ItemRank
                    /*  <SelectBox */

                    primaryColor={primaryColor}
                    items={[
                      { pkey: '🔑', value: 'Rair', id: 1 }
                      // { pkey: `🔑`, value: "Ultra Rair", id: 2 },
                      // { pkey: `🔑`, value: "Common", id: 3 },
                    ]}
                  />
                </div>
              </div>
              <div>
                <span>Serial number</span>
                <div>
                  <SelectBox
                    // handleClickToken={handleClickToken}
                    // selectedToken={selectedToken}
                    // contractName={contractName}
                    primaryColor={primaryColor}
                    // selectItem={onSelect}
                    items={
                      tokenData.length &&
                      tokenData.map((p) => {
                        return {
                          value: p.metadata.name,
                          id: p._id,
                          token: p.token
                        };
                      })
                    }></SelectBox>
                </div>
              </div>
              <div
                style={{
                  marginTop: '18px'
                }}>
                <button
                  style={{
                    width: '228px',
                    height: '48px',
                    border: 'none',
                    borderRadius: '16px',
                    color: textColor,
                    backgroundImage:
                      'linear-gradient(96.34deg, #725BDB 0%, #805FDA 10.31%, #8C63DA 20.63%, #9867D9 30.94%, #A46BD9 41.25%, #AF6FD8 51.56%, #AF6FD8 51.56%, #BB73D7 61.25%, #C776D7 70.94%, #D27AD6 80.62%, #DD7ED6 90.31%, #E882D5 100%)'
                  }}>
                  Owned
                </button>
              </div>
            </div>
            <Accordion allowZeroExpanded /* allowMultipleExpanded*/>
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton>Properties</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div className="col-12 row mx-0">
                    {tokenData[selectedToken].metadata
                      ? Object.keys(tokenData[selectedToken]).length &&
                        tokenData[selectedToken].metadata?.attributes.map(
                          (item, index) => {
                            if (item.trait_type === 'External URL') {
                              return (
                                <div
                                  key={index}
                                  className="col-4 my-2 p-1 custom-desc-to-offer"
                                  style={{
                                    color: textColor,
                                    textAlign: 'center'
                                  }}>
                                  <span>{item?.trait_type}:</span>
                                  <br />
                                  <a
                                    style={{ color: textColor }}
                                    href={item?.value}>
                                    {item?.value}
                                  </a>
                                </div>
                              );
                            }
                            const percent = randomInteger(1, 40);
                            return (
                              <div
                                key={index}
                                className="col-4 my-2 p-1 custom-desc-to-offer">
                                <div
                                  style={{
                                    padding: '0.1rem 1rem',
                                    textAlign: 'center'
                                  }}>
                                  <span>{item?.trait_type}:</span>
                                  <span style={{ color: textColor }}>
                                    {item?.value}
                                  </span>
                                </div>
                                <span
                                  style={{
                                    marginLeft: '15rem',
                                    color: percentToRGB(percent)
                                  }}>
                                  {percent} %
                                </span>
                              </div>
                            );
                          }
                        )
                      : null}
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton>Description</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div className=" custom-desc-to-offer-wrapper">
                    <div className="my-2 px-4 custom-desc-to-offer">
                      {toUpper(tokenData[selectedToken].metadata?.artist)}
                    </div>
                    <div className="my-2 px-4 custom-desc-to-offer">
                      {tokenData[selectedToken].metadata?.description}
                    </div>
                    <div className="my-2 px-4 custom-desc-to-offer">
                      <a href={tokenData[selectedToken].metadata?.external_url}>
                        {tokenData[selectedToken].metadata?.external_url}
                      </a>
                    </div>
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton>Unlockable content</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div
                    // onClick={onClick}
                    style={{
                      margin: '1rem',
                      height: '135px'
                    }}>
                    <div
                      style={{
                        display: 'flex',
                        borderRadius: '16px',
                        width: '592px',
                        backgroundColor: '#4E4D4DCC'
                      }}>
                      <div
                        style={{
                          position: 'relative'
                        }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            background: '#CCA541',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '35%',
                            left: '50%',
                            transform: 'translate(-50%, -35%)',
                            zIndex: '1'
                          }}>
                          <FontAwesomeIcon
                            style={{ paddingLeft: '8.5px', paddingTop: '7px' }}
                            icon={faLock}
                          />
                          <p
                            style={{
                              textAlign: 'center',
                              marginLeft: '-2rem',
                              marginTop: '9px',
                              width: 'max-content'
                            }}>
                            Coming soon
                          </p>
                        </div>
                        <img
                          style={{
                            width: '230px',
                            opacity: '0.4',
                            height: '135px',
                            filter: 'blur(3px)'
                          }}
                          src={data?.tokens[0].metadata?.image}
                          alt="NFT powered by Rair Tech"
                        />
                      </div>
                      <div
                        style={{
                          borderLeft: '4px solid #CCA541',
                          display: 'flex',
                          flexDirection: 'column',
                          width: 'inher',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingLeft: '1rem'
                        }}>
                        <div>
                          {' '}
                          <p>Video {data?.tokens[0].metadata?.name}</p>{' '}
                        </div>
                        <div>
                          <p
                            style={{
                              color: '#A7A6A6'
                            }}>
                            00:03:23
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
              {/* <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Collection info</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>VIDEO</AccordionItemPanel>
            </AccordionItem> */}
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton>Authenticity</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>Link</AccordionItemPanel>
              </AccordionItem>
            </Accordion>
          </div>
          <div style={{ maxWidth: '1600px', margin: 'auto' }}>
            {tokenData && (
              <Carousel
                itemWidth={'300px'}
                showDots={false}
                infinite={true}
                responsive={responsive}
                itemClass="carousel-item-padding-4-px">
                {tokenData.map((p, index) => (
                  <OfferItem
                    key={index}
                    index={index}
                    metadata={p.metadata}
                    token={p.token}
                    handleClickToken={handleClickToken}
                    setSelectedToken={setSelectedToken}
                    selectedToken={selectedToken}
                  />
                ))}
              </Carousel>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NftDataPage;
