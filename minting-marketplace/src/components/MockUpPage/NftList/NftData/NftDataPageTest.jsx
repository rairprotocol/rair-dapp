import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { utils } from "ethers";
import Swal from "sweetalert2";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { metamaskCall } from "../../../../utils/metamaskUtils.js";

// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";

import chainDataFront from "../../utils/blockchainDataFront";
import ItemRank from "../../SelectBox/ItemRank";
import SelectNumber from "../../SelectBox/SelectNumber/SelectNumber";
import ReactPlayer from "react-player";
import chainData from "../../../../utils/blockchainData.js";
import { useDispatch } from "react-redux";
import setDocumentTitle from "../../../../utils/setTitle";

import { BreadcrumbsView } from "../Breadcrumbs/Breadcrumbs.jsx";
import AuthenticityBlock from "./AuthenticityBlock/AuthenticityBlock.jsx";
import NftSingleUnlockables from "./NftSingleUnlockables.jsx";
import CustomButton from "../../utils/button/CustomButton.jsx";
import CollectionInfo from "./CollectionInfo/CollectionInfo.jsx";
import TitleCollection from "./TitleCollection/TitleCollection.jsx";

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
  const [offerDataInfo, setOfferDataInfo] = useState();

  const { minterInstance } = useSelector((state) => state.contractStore);
  const [playing, setPlaying] = useState(false);
  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    setDocumentTitle("Single Token");
    dispatch({
      type: "SHOW_SIDEBAR_TRUE",
    });
  }, [dispatch]);

  function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  const getParticularOffer = useCallback(async () => {
    let response = await (
      await fetch(
        `/api/nft/network/${blockchain}/${contract}/${product}/offers`,
        {
          method: "GET",
        }
      )
    ).json();

    console.log(response, "response");

    if (response.success) {
      setOfferDataInfo(response.product.offers);
    }

  }, [product, contract, blockchain]);

  useEffect(() => {
    getParticularOffer()
  }, [getParticularOffer])

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
    Swal.fire({
      title: "Buying token",
      html: "Awaiting transaction completion",
      icon: "info",
      showConfirmButton: false,
    });
    if (
      await metamaskCall(
        minterInstance.buyToken(
          offerData.offerPool,
          offerData.offerIndex,
          selectedToken,
          { value: offerData.price }
        )
      )
    ) {
      Swal.fire("Success", "Now, you are the owner of this token", "success");
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
            fontSize: "13px",
            height: "48px",
            border: "none",
            borderRadius: "16px",
            color: `var(--${textColor})`,
            backgroundImage:
              "linear-gradient(96.34deg, #725BDB 0%, #805FDA 10.31%, #8C63DA 20.63%, #9867D9 30.94%, #A46BD9 41.25%, #AF6FD8 51.56%, #AF6FD8 51.56%, #BB73D7 61.25%, #C776D7 70.94%, #D27AD6 80.62%, #DD7ED6 90.31%, #E882D5 100%)",
          }}
        >
          {/* { `Purchase • ${minPrice} ${data?.product.blockchain}` } ||  */}
          Purchase •{" "}
          {utils
            .formatEther(price !== Infinity && price !== undefined ? price : 0)
            .toString()}{" "}
          {chainData[blockchain]?.symbol}
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

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  return (
    <div id="nft-data-page-wrapper">
      <BreadcrumbsView />
      <div>
        <TitleCollection
          currentUser={currentUser}
          title={selectedData?.name}
          userName={tokenData[0]?.ownerAddress}
        />
        <div
          style={{
            maxWidth: "1600px",
            margin: "auto",
            borderRadius: "16px",
            padding: "24px 0",
          }}
        >
          <div
            className="nft-collection"
            style={{
              background: "#383637",
            }}
          >
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
                  backgroundImage: `url(${selectedData?.image ? selectedData.image : "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW"})`,
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
                    {
                      pkey: (
                        <i style={{ color: `red` }} className="fas fa-key" />
                      ),
                      value: "Rair",
                      id: 1,
                    },
                    { pkey: `🔑`, value: "Ultra Rair", id: 2 },
                    {
                      pkey: (
                        <i style={{ color: `silver` }} className="fas fa-key" />
                      ),
                      value: "Common",
                      id: 3,
                    },
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
            allowMultipleExpanded /* allowMultipleExpanded /* allowZeroExpanded allowMultipleExpanded*/
          >
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
                        if (
                          item.trait_type === "image" ||
                          item.trait_type === "animation_url"
                        ) {
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
                <AccordionItemButton>This NFT unlocks</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <NftSingleUnlockables
                  blockchain={blockchain}
                  contract={contract}
                  product={product}
                  productsFromOffer={productsFromOffer}
                  selectedData={selectedData}
                  selectedToken={selectedToken}
                />
                <CustomButton
                  onClick={() =>
                    history.push(
                      `/unlockables/${blockchain}/${contract}/${product}/${selectedToken}`
                    )
                  }
                  text="More Unlockables"
                  width="288px"
                  height="48px"
                  textColor={textColor}
                  primaryColor={primaryColor}
                  margin={'0 auto'}
                />
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Collection info</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>

                <CollectionInfo offerData={offerDataInfo} blockchain={blockchain} />

              </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Authenticity</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                {/* <div>{showLink()}</div> */}
                <AuthenticityBlock
                  tokenData={tokenData}
                  selectedToken={selectedToken}
                />
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </div>
        <div style={{ maxWidth: "1200px", margin: "auto" }}>
          {/* <span style={{}}>More by {tokenData[selectedToken]?.ownerAddress ? tokenData[selectedToken]?.ownerAddress : "User" }</span> */}
          {/* {tokenData.length ? (
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
          )} */}
        </div>
      </div>
    </div>
  );
};

export default NftDataPageTest;
