import React, { useState /*useCallback*/ } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { utils } from 'ethers';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { metamaskCall } from '../../../../utils/metamaskUtils.js';

import Carousel from "react-multi-carousel";
import chainDataFront from "../../utils/blockchainDataFront";
import ItemRank from "../../SelectBox/ItemRank";
import OfferItem from "../OfferItem";
import SelectNumber from "../../SelectBox/SelectNumber/SelectNumber";
import ReactPlayer from "react-player";
import chainData from '../../../../utils/blockchainData.js';

import "react-multi-carousel/lib/styles.css";

const NftDataPageTest = ({
  blockchain,
  contract,
  currentUser,
  data,
  handleClickToken,
  product,
  productsFromOffer,
  primaryColor,
  selectedData,
  selectedToken,
  setSelectedToken,
  tokenData,
  totalCount,
  textColor,
  offerData,
  offerPrice,
}) => {
  const history = useHistory();
  const { minterInstance } = useSelector((state) => state.contractStore);
  const [playing, setPlaying] = useState(false);
  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1500 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1500, min: 1024 },
      // paddingLeft: "2rem",
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  function percentToRGB(percent) {
    if (percent) {
      if (percent < 15) {
        return "#95F619";
      } else if (15 <= percent && percent < 35) {
        return "#F6ED19";
      } else {
        return "#F63419";
      }
    }
  }

  function toUpper(string) {
    if (string) {
      return string[0].toUpperCase() + string.slice(1);
    }
  }

  if (offerPrice) {
    var minPrice = arrayMin(offerPrice);
    var maxPrice = arrayMax(offerPrice);
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

  function checkPrice() {
    if (maxPrice === minPrice) {
      const samePrice = maxPrice;
      return `${samePrice} 
      `;
    }
    return `${minPrice} – ${maxPrice} 
    `;
  }

  function showLink() {
    //  checks if you are the owner and shows only to the owner

    // if (currentUser === tokenData[selectedToken]?.ownerAddress) {
    //   return (
    //     <div>
    //       {tokenData[selectedToken]?.authenticityLink !== "none" ? (
    //         <a href={tokenData[selectedToken]?.authenticityLink}>
    //           {tokenData[selectedToken]?.authenticityLink}
    //         </a>
    //       ) : (
    //         "Not minted yet"
    //       )}
    //     </div>
    //   );
    // } else {
    //   return <span>Not minted yet</span>;
    // }

    // shows everyone
    // v1
    // return (
    //   <div>
    //     {tokenData[selectedToken]?.authenticityLink ? (
    //       <a href={tokenData[selectedToken]?.authenticityLink}>
    //         {tokenData[selectedToken]?.authenticityLink}
    //       </a>
    //     ) : (
    //       "Not minted yet"
    //     )}
    //   </div>
    // );

    // v2
    // eslint-disable-next-line array-callback-return
    return tokenData.map((el, index) => {
      if (Number(el.token) === Number(selectedToken)) {
        return (
          <a
            className="nftDataPageTest-a-hover"
            key={index}
            href={el?.authenticityLink}
          >
            {el?.authenticityLink}
          </a>
        );
      }
      //   //  else {
      // return <span style={{cursor:"default"}}>Not minted yet</span>;
      //   // }
    });

    // if (tokenData[selectedToken]) {
    // eslint-disable-next-line array-callback-return
    //     return tokenData.map((el, index) => {
    //       if (Number(el.token) === Number(selectedToken)) {
    //         return (
    //           <a
    //             className="nftDataPageTest-a-hover"
    //             key={index}
    //             href={el?.authenticityLink}
    //           >
    //             {el?.authenticityLink}
    //           </a>
    //         );
    //       }
    //     });
    //   } else {
    //     return <span style={{ cursor: "default" }}>Not minted yet</span>;
    //   }
  }

  const switchEthereumChain = async (chainData) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainData.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [chainData],
          });
        } catch (addError) {
          console.error(addError);
        }
      } else {
        console.error(switchError);
      }
    }
  };

  const CheckEthereumChain = async () => {
    switch (blockchain) {
      case "0x61":
        switchEthereumChain({
          chainId: "0x61",
          chainName: "Binance Testnet",
        });
        break;

      case "0x3e9":
        switchEthereumChain({
          chainId: "0x3e9",
          chainName: "Klaytn Baobab",
        });
        break;

      case "0x13881":
        switchEthereumChain({
          chainId: "0x13881",
          chainName: "Matic Testnet Mumbai",
        });
        break;

      case "0x89":
        switchEthereumChain({
          chainId: "0x89",
          chainName: "Matic(Polygon) Mainnet",
        });
        break;

      case "0x3":
        switchEthereumChain({
          chainId: "0x3",
          chainName: "Ropsten (Ethereum)",
        });
        break;

      case "0x5":
        switchEthereumChain({
          chainId: "0x5",
          chainName: "Goerli (Ethereum)",
        });
        break;

      default:
        Swal.fire(
          "Error",
          " This chain has not been added to MetaMask, yet",
          "error"
        );
    }
  };

  const buyContract = async () => {
    Swal.fire({title: 'Buying token', html: 'Awaiting transaction completion', icon: 'info', showConfirmButton: false});
    if (
      await metamaskCall(minterInstance.buyToken(
        offerData.offerPool,
        offerData.offerIndex,
        selectedToken,
        { value: offerData.price }
      ),
      "Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!"
      )
    ) {
      Swal.fire('Success', 'Now, you are the owner of this token', 'success');
    }
  };

  function checkOwner() {
    let price = offerData?.price || minPrice;
    if (currentUser === tokenData[selectedToken]?.ownerAddress) {
      return (
        <button
          style={{
            width: "228px",
            height: "48px",
            border: "none",
            borderRadius: "16px",
            color: `var(--${textColor})`,
            backgroundImage:
              "linear-gradient(96.34deg, #725BDB 0%, #805FDA 10.31%, #8C63DA 20.63%, #9867D9 30.94%, #A46BD9 41.25%, #AF6FD8 51.56%, #AF6FD8 51.56%, #BB73D7 61.25%, #C776D7 70.94%, #D27AD6 80.62%, #DD7ED6 90.31%, #E882D5 100%)",
          }}
        >
          Owned
        </button>
      );
    } else
      return (
        <button
          className="btn rounded-rair btn-stimorol"
          disabled={!offerData?.offerPool}
          onClick={
            window?.ethereum?.chainId === blockchain
              ? buyContract
              : () => CheckEthereumChain()
          }
          // onClick={() => buyContract()}
          // onClick={() => alert("Coming soon")}
          style={{
            width: "291px",
            fontSize: '13px',
            height: "48px",
            border: "none",
            borderRadius: "16px",
            color: `var(--${textColor})`,
            backgroundImage:
              "linear-gradient(96.34deg, #725BDB 0%, #805FDA 10.31%, #8C63DA 20.63%, #9867D9 30.94%, #A46BD9 41.25%, #AF6FD8 51.56%, #AF6FD8 51.56%, #BB73D7 61.25%, #C776D7 70.94%, #D27AD6 80.62%, #DD7ED6 90.31%, #E882D5 100%)",
          }}
        >
          {/* { `Purchase • ${minPrice} ${data?.product.blockchain}` } ||  */}
          Purchase • {utils.formatEther(price !== Infinity && price !== undefined ? price : 0).toString()} {chainData[blockchain]?.symbol}
        </button>
      );
  }
  // function checkDataOfProperty() {
  //   if ( selectedData === 'object' && selectedData !== null) {
  //       if(selectedData.length){
  //       return selectedData?.attributes.map((item, index) => {
  //         if (item.trait_type === "External URL") {
  //           return (
  //             <div
  //               key={index}
  //               className="col-4 my-2 p-1 custom-desc-to-offer"
  //               style={{
  //                 color: textColor,
  //                 textAlign: "center",
  //               }}
  //             >
  //               <span>{item?.trait_type}:</span>
  //               <br />
  //               <a
  //                 style={{ color: textColor }}
  //                 href={item?.value}
  //               >
  //                 {item?.value}
  //               </a>
  //             </div>
  //           );
  //         }
  //         const percent = randomInteger(1, 40);
  //         return (
  //           <div
  //             key={index}
  //             className="col-4 my-2 p-1 custom-desc-to-offer"
  //           >
  //             <div className="custom-desc-item">
  //               <span>{item?.trait_type}:</span>
  //               <span style={{ color: textColor }}>
  //                 {item?.value}
  //               </span>
  //             </div>
  //             <div className="custom-offer-percents">
  //               <span
  //                 style={{
  //                   color: percentToRGB(percent),
  //                 }}
  //               >
  //                 {percent}%
  //               </span>
  //             </div>
  //           </div>
  //         );
  //       })
  //       }
  //   } else {
  //     if (Object.keys(selectedData).length) {
  //       return selectedData?.attributes.map((item, index) => {
  //         if (item.trait_type === "External URL") {
  //           return (
  //             <div
  //               key={index}
  //               className="col-4 my-2 p-1 custom-desc-to-offer"
  //               style={{
  //                 color: textColor,
  //                 textAlign: "center",
  //               }}
  //             >
  //               <span>{item?.trait_type}:</span>
  //               <br />
  //               <a style={{ color: textColor }} href={item?.value}>
  //                 {item?.value}
  //               </a>
  //             </div>
  //           );
  //         }
  //         const percent = randomInteger(1, 40);
  //         return (
  //           <div key={index} className="col-4 my-2 p-1 custom-desc-to-offer">
  //             <div className="custom-desc-item">
  //               <span>{item?.trait_type}:</span>
  //               <span style={{ color: textColor }}>{item?.value}</span>
  //             </div>
  //             <div className="custom-offer-percents">
  //               <span
  //                 style={{
  //                   color: percentToRGB(percent),
  //                 }}
  //               >
  //                 {percent}%
  //               </span>
  //             </div>
  //           </div>
  //         );
  //       });
  //     }
  //   }
  // }

  return (
    <div id="nft-data-page-wrapper">
      <div>
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
            borderRadius: "16px",
            padding: "24px 0",
          }}
        >
          <div className="ntf-header">
            <h2
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: "40px",
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: "28px",
                letterSpacing: "0px",
                textAlign: "left",
                marginBottom: "3rem",
                marginTop: "1rem",
                marginLeft: "3px",
              }}
            >
              {selectedData?.name}
            </h2>
            <div className="btn-share">
              <button
                style={{
                  color: `var(--${textColor})`,
                }}
              >
                Share
              </button>
            </div>
          </div>
          <div className="nft-collection">
            {selectedData?.animation_url ? (
              <div
                style={{
                  width: "600px",
                  height: "600px",
                  margin: "auto",
                }}
              >
                <ReactPlayer
                  width={"100%"}
                  height={"auto"}
                  controls
                  playing={playing}
                  onReady={handlePlaying}
                  url={selectedData?.animation_url}
                  light={
                    selectedData.image
                      ? selectedData?.image
                      : "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW"
                  }
                  loop={false}
                  onEnded={handlePlaying}
                />
              </div>
            ) : (
              <div
                style={{
                  margin: "auto",
                  backgroundImage: `url(${selectedData?.image})`,
                  width: "604px",
                  height: "45rem",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            )}
          </div>
          <div className="main-tab">
            <div>
              <div className="collection-label-name">Price range</div>
              <div
                style={{
                  borderRadius: "16px",
                  padding: "10px",
                  width: "288px",
                  height: "48px",
                  border: "1px solid #D37AD6",
                  // backgroundImage:
                  // "linear-gradient(96.34deg, #725BDB 0%, #805FDA 10.31%, #8C63DA 20.63%, #9867D9 30.94%, #A46BD9 41.25%, #AF6FD8 51.56%, #AF6FD8 51.56%, #BB73D7 61.25%, #C776D7 70.94%, #D27AD6 80.62%, #DD7ED6 90.31%, #E882D5 100%)",
                  // background: `${primaryColor === "rhyno" ? "var(--rhyno)" : "#383637"
                  //   }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ width: "24px", transform: "scale(1.2)" }}
                  src={`${chainDataFront[data?.product.blockchain]?.image}`}
                  alt=""
                />
                <span
                  style={{
                    paddingLeft: "9px",
                    marginRight: "3rem",
                  }}
                >
                  {
                    offerPrice && `${checkPrice()}`
                    // `${minPrice} – ${maxPrice} ${data?.product.blockchain || ""
                    // } `
                  }
                </span>
                <span
                  style={{
                    color: "#E882D5",
                  }}
                >
                  {data?.product.blockchain || ""}
                </span>
              </div>
            </div>
            <div>
              <div className="collection-label-name">Item rank</div>
              <div>
                <ItemRank
                  primaryColor={primaryColor}
                  items={[
                    { pkey: `🔑`, value: "Rair", id: 1 },
                    { pkey: `🔑`, value: "Ultra Rair", id: 2 },
                    { pkey: `🔑`, value: "Common", id: 3 },
                  ]}
                />
              </div>
            </div>
            <div>
              <div className="collection-label-name">Serial number</div>
              <div>
                {tokenData.length ? (
                  <SelectNumber
                    blockchain={blockchain}
                    product={product}
                    contract={contract}
                    totalCount={totalCount}
                    handleClickToken={handleClickToken}
                    selectedToken={selectedToken}
                    setSelectedToken={setSelectedToken}
                    items={
                      tokenData &&
                      tokenData.map((p) => {
                        return {
                          value: p.metadata.name,
                          id: p._id,
                          token: p.token,
                        };
                      })
                    }
                  />
                ) : (
                  <></>
                )}
                {/* <SelectNumber
                  handleClickToken={handleClickToken}
                  selectedToken={selectedToken}
                  items={
                    tokenData &&
                    tokenData.map((p) => {
                      return {
                        value: p.metadata.name,
                        id: p._id,
                        token: p.token,
                      };
                    })
                  }
                /> */}
              </div>
            </div>
            <div
              style={{
                marginTop: "18px",
              }}
            >
              {checkOwner()}
            </div>
          </div>
          <Accordion
            allowMultipleExpanded /* allowZeroExpanded allowMultipleExpanded*/
          >
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Properties</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="col-12 row mx-0 box--properties">
                  {/* {checkDataOfProperty()} */}
                  {selectedData ? (
                    Object.keys(selectedData).length &&
                    // ? selectedData.length &&
                    selectedData?.attributes.length > 0 ? (
                      selectedData?.attributes.map((item, index) => {
                        if (
                          item.trait_type === "External URL" &&
                          "external_url"
                        ) {
                          return (
                            <div
                              key={index}
                              className="col-4 my-2 p-1 custom-desc-to-offer"
                              style={{
                                cursor: "default",
                                color: textColor,
                                textAlign: "center",
                              }}
                            >
                              <span>{item?.trait_type}:</span>
                              <br />
                              <a
                                className="custom-offer-pic-link"
                                style={{ color: textColor }}
                                href={item?.value}
                              >
                                {item?.value.length > 15 ? "..." : ""}
                                {item?.value.substr(
                                  item?.value.indexOf("\n") + 19
                                )}
                              </a>
                            </div>
                          );
                        }
                        if (item.trait_type === "image") {
                          return (
                            <div
                              key={index}
                              className="col-4 my-2 p-1 custom-desc-to-offer"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                color: textColor,
                                textAlign: "center",
                              }}
                            >
                              <span>
                                {" "}
                                <a
                                  className="custom-offer-pic-link"
                                  style={{
                                    color: textColor,
                                  }}
                                  target="_blank"
                                  rel="noreferrer"
                                  href={item?.value}
                                >
                                  {toUpper(item?.trait_type)}
                                </a>
                              </span>
                            </div>
                          );
                        }
                        const percent = randomInteger(1, 40);
                        return (
                          <div
                            key={index}
                            className="col-4 my-2 p-1 custom-desc-to-offer"
                          >
                            <div className="custom-desc-item">
                              <span>{item?.trait_type}:</span>
                              <span style={{ color: textColor }}>
                                {item?.value}
                              </span>
                            </div>
                            <div className="custom-offer-percents">
                              <span
                                style={{
                                  color: percentToRGB(percent),
                                }}
                              >
                                {percent}%
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div>You don't have any properties</div>
                    )
                  ) : null}
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
                    {toUpper(selectedData?.artist)}
                  </div>
                  <div className="my-2 px-4 custom-desc-to-offer">
                    {selectedData?.description}
                  </div>
                  <div className="my-2 px-4 custom-desc-to-offer">
                    <a href={selectedData?.external_url}>
                      {selectedData?.external_url}
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
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {(productsFromOffer?.length &&
                    productsFromOffer.map((v) => {
                      return (
                        <div
                          key={v._id}
                          style={{
                            margin: "1rem",
                            height: "135px",
                          }}
                        >
                          <div
                            onClick={() =>
                              history.push(`/watch/${v._id}/${v.mainManifest}`)
                            }
                            style={{
                              display: "flex",
                              borderRadius: "16px",
                              // width: "592px",
                              minWidth: "400px",
                              backgroundColor: "#4E4D4DCC",
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  background: "#CCA541",
                                  borderRadius: "50%",
                                  position: "absolute",
                                  top: "35%",
                                  left: "50%",
                                  transform: "translate(-50%, -35%)",
                                  zIndex: "1",
                                }}
                              >
                                <i
                                  style={{
                                    paddingLeft: "1px",
                                    paddingTop: "8px",
                                  }}
                                  className="fa fa-lock"
                                  aria-hidden="true"
                                ></i>
                                <p
                                  style={{
                                    textAlign: "center",
                                    marginLeft: "-2rem",
                                    marginTop: "9px",
                                    width: "max-content",
                                  }}
                                >
                                  Coming soon
                                </p>
                              </div>
                              {/* {productsFromOffer.length && productsFromOffer.map((v) => {return } )} */}
                              <img
                                style={{
                                  width: "230px",
                                  opacity: "0.4",
                                  height: "135px",
                                  filter: "blur(3px)",
                                }}
                                src={`${v?.staticThumbnail}`}
                                // src={selectedData?.image}
                                alt=""
                              />
                            </div>
                            <div
                              style={{
                                borderLeft: "4px solid #CCA541",
                                display: "flex",
                                flexDirection: "column",
                                width: "inher",
                                justifyContent: "center",
                                alignItems: "flex-start",
                                paddingLeft: "24px",
                              }}
                            >
                              <div>
                                {" "}
                                <p style={{ fontSize: 20 }}>
                                  {v?.title}
                                  {/* Video {selectedData?.name} */}
                                </p>{" "}
                              </div>
                              <div>
                                <p
                                  style={{
                                    color: "#A7A6A6",
                                    fontSize: 20,
                                  }}
                                >
                                  {/* 00:03:23 */}
                                  {v?.duration}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })) || (
                    <div
                      style={{
                        margin: "1rem",
                        height: "135px",
                      }}
                    >
                      <div
                        onClick={
                          () => console.log("Cooming soon")
                          // history.push(
                          //   `/watch/${productsFromOffer._id}/${productsFromOffer.mainManifest}`
                          // )
                        }
                        style={{
                          display: "flex",
                          borderRadius: "16px",
                          width: "592px",
                          backgroundColor: "#4E4D4DCC",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              background: "#CCA541",
                              borderRadius: "50%",
                              position: "absolute",
                              top: "35%",
                              left: "50%",
                              transform: "translate(-50%, -35%)",
                              zIndex: "1",
                            }}
                          >
                            <i
                              style={{
                                paddingLeft: "1px",
                                paddingTop: "8px",
                              }}
                              className="fa fa-lock"
                              aria-hidden="true"
                            ></i>
                            <p
                              style={{
                                textAlign: "center",
                                marginLeft: "-2rem",
                                marginTop: "9px",
                                width: "max-content",
                              }}
                            >
                              Coming soon
                            </p>
                          </div>
                          {/* {productsFromOffer.length && productsFromOffer.map((v) => {return } )} */}
                          <img
                            style={{
                              width: "230px",
                              opacity: "0.4",
                              height: "135px",
                              filter: "blur(3px)",
                            }}
                            // src={`/thumbnails/${v?.thumbnail}.png`}
                            src={selectedData?.image}
                            alt=""
                          />
                        </div>
                        <div
                          style={{
                            borderLeft: "4px solid #CCA541",
                            display: "flex",
                            flexDirection: "column",
                            width: "inher",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            paddingLeft: "24px",
                          }}
                        >
                          <div>
                            {" "}
                            <p style={{ fontSize: 20 }}>
                              {/* {v?.title} */}
                              Video {selectedData?.name}
                            </p>{" "}
                          </div>
                          <div>
                            <p
                              style={{
                                color: "#A7A6A6",
                                fontSize: 20,
                              }}
                            >
                              00:03:23
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
              <AccordionItemPanel>
                <div>{showLink()}</div>
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </div>
        <div style={{ maxWidth: "1200px", margin: "auto" }}>
          {/* <span style={{}}>More by {tokenData[selectedToken]?.ownerAddress ? tokenData[selectedToken]?.ownerAddress : "User" }</span> */}
          {tokenData.length ? (
            <Carousel
              itemWidth={"300px"}
              showDots={false}
              // infinite={true}
              responsive={responsive}
              itemClass="carousel-item-padding-4-px"
            >
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
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default NftDataPageTest;
