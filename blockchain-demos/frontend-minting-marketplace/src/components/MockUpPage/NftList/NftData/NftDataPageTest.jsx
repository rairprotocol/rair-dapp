import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import Carousel from "react-multi-carousel";
import chainDataFront from "../../utils/blockchainDataFront";
import ItemRank from "../../SelectBox/ItemRank";
import OfferItem from "../OfferItem";
import SelectNumber from "../../SelectBox/SelectNumber/SelectNumber";
import ReactPlayer from "react-player";

import "react-multi-carousel/lib/styles.css";

const NftDataPageTest = ({
  currentUser,
  tokenData,
  selectedData,
  primaryColor,
  textColor,
  selectedToken,
  offerPrice,
  data,
  handleClickToken,
  setSelectedToken,
  contract,
  onSelect,
  productsFromOffer,
}) => {
  const history = useHistory();
  const [playing, setPlaying] = useState(false);
  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      paddingLeft: "2rem",
      items: 4,
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

  function checkOwner() {
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
          onClick={() => alert("Coming soon")}
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
          Purchase • {minPrice} {data?.product.blockchain}
        </button>
      );
  }

  // function openVideo() {
  //   history.push(`/watch/${productsFromOffer[selectedToken]._id}/${productsFromOffer[selectedToken].mainManifest}`);
  // }
  //  const closeModal = ( ) => {
  //    history.push(`/all`)
  //  }
  // if (!tokenData[selectedToken]) {
  //   return 'No token, sorry, go away:('
  // }
  // if (!data?.tokens) {
  //   return 'No data.tokens, sorry :('
  // }
  // console.log('@@@', data?.tokens)

  // console.log(productsFromOffer, "@!!productsFromOffer!!@");

    // if(primaryColor === 'charcoal'){
  //   (function () {
  //     let angle = 0;
  //     let p = document.querySelector('p');
  //     if(p){
  //       let text = p.textContent.split('');
  //       var len = text.length;
  //       var phaseJump = 360 / len;
  //       var spans;
  //       p.innerHTML = text.map(function (char) {
  //         return '<span>' + char + '</span>';
  //       }).join('');

  //       spans = p.children;
  //     }
  //     else console.log('kik');

  //     (function wheee () {
  //       for (var i = 0; i < len; i++) {
  //         spans[i].style.color = 'hsl(' + (angle + Math.floor(i * phaseJump)) + ', 55%, 70%)';
  //       }
  //       angle++;
  //       requestAnimationFrame(wheee);
  //     })();
  //   })();
  // }
  return (
    <div>
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
        onClick={closeModal}
      >
        &#215;
      </button> */}
        <div
          style={{
            maxWidth: "1600px",
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
              {selectedData.name}
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
                  background: `${
                    primaryColor === "rhyno" ? "var(--rhyno)" : "#383637"
                  }`,
                  display: "flex",
                  alignItems: "center",
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
                  {offerPrice &&
                    `${minPrice} – ${maxPrice} ${data?.product.blockchain}`}
                </span>
                <span
                  style={{
                    color: "#E882D5",
                  }}
                >
                  ERC
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
                <SelectNumber
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
                />
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
                  {selectedData
                    ? selectedData.length &&
                      selectedData?.attributes.map((item, index) => {
                        if (item.trait_type === "External URL") {
                          return (
                            <div
                              key={index}
                              className="col-4 my-2 p-1 custom-desc-to-offer"
                              style={{
                                color: textColor,
                                textAlign: "center",
                              }}
                            >
                              <span>{item?.trait_type}:</span>
                              <br />
                              <a
                                style={{ color: textColor }}
                                href={item?.value}
                              >
                                {item?.value}
                              </a>
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
                  {(productsFromOffer.length &&
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
                                src={`/thumbnails/${v?.thumbnail}.png`}
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
                                  00:03:23
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
                        onClick={() =>
                          console.log("Cooming soon")
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
                <div>
                  {tokenData[selectedToken]?.authenticityLink ? (
                    <div>
                      {tokenData[selectedToken]?.authenticityLink !== "none" ? (
                        <a href={tokenData[selectedToken]?.authenticityLink}>
                          {tokenData[selectedToken]?.authenticityLink}
                        </a>
                      ) : (
                        "Not minted yet"
                      )}
                    </div>
                  ) : (
                    <span>Not minted yet</span>
                  )}
                </div>
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </div>
        <div style={{ maxWidth: "1600px", margin: "auto" }}>
          {/* <span style={{}}>More by {tokenData[selectedToken]?.ownerAddress ? tokenData[selectedToken]?.ownerAddress : "User" }</span> */}
          {tokenData && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default NftDataPageTest;
