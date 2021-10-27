import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import chainData from "../../../../utils/blockchainData";
import Carousel from "react-multi-carousel";
import ItemRank from "../../SelectBox/ItemRank";
import SelectBox from "../../SelectBox/SelectBox";
import OfferItem from "../OfferItem";

const NftDataPageTest = ({
  tokenData,
  selectedData,
  primaryColor,
  textColor,
  selectedToken,
  offerPrice,
  data,
  handleClickToken,
  contract,
  onSelect,
}) => {
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
if(offerPrice){
  

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

  

  // if (!tokenData[selectedToken]) {
  //   return 'No token, sorry, go away:('
  // }
  // if (!data?.tokens) {
  //   return 'No data.tokens, sorry :('
  // }
  // console.log('@@@', data?.tokens)

  return (
    <div>
      <h1>TEST page</h1>
      {/* {tokenData && data && ( */}
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
            maxWidth: "1600px",
            margin: "auto",
            backgroundColor: `var(--${primaryColor})`,
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
              <button>Share</button>
            </div>
          </div>
          <div
            //   onClick={onClick}
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
          <div
            className="main-tab"
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "1rem",
              padding: "2rem",
              alignItems: "center",
            }}
          >
            <div>
              <span>Price range</span>
              <div
                style={{
                  borderRadius: "16px",
                  padding: "10px",
                  width: "228px",
                  height: "48px",
                  backgroundColor: "#383637",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ width: "24px", transform: "scale(1.2)" }}
                  src={`${chainData[data?.product.blockchain]?.image}`}
                  alt=""
                />
                <span
                  style={{
                    paddingLeft: "9px",
                    marginRight: "3rem",
                  }}
                >
                  { offerPrice &&  `${minPrice} – ${maxPrice} ETH` }
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
              <span>Item rank</span>
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
              <span>Serial number</span>
              <div>
                <SelectBox
                  handleClickToken={handleClickToken}
                  selectedToken={selectedToken}
                  contractName={contract}
                  primaryColor={primaryColor}
                  selectItem={onSelect}
                  items={
                    tokenData.length &&
                    tokenData.map((p) => {
                      return {
                        value: p.metadata.name,
                        id: p._id,
                        token: p.token,
                      };
                    })
                  }
                ></SelectBox>
              </div>
            </div>
            <div
              style={{
                marginTop: "18px",
              }}
            >
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
            </div>
          </div>
          <Accordion allowZeroExpanded /* allowMultipleExpanded*/>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Properties</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="col-12 row mx-0">
                  {selectedData
                    ? Object.keys(selectedData).length &&
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
                            <div
                              style={{
                                padding: "0.1rem 1rem",
                                textAlign: "center",
                              }}
                            >
                              <span>{item?.trait_type}:</span>
                              <span style={{ color: textColor }}>
                                {item?.value}
                              </span>
                            </div>
                            <span
                              style={{
                                marginLeft: "15rem",
                                color: percentToRGB(percent),
                              }}
                            >
                              {percent} %
                            </span>
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
                  // onClick={onClick}
                  style={{
                    margin: "1rem",
                    height: "135px",
                  }}
                >
                  <div
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
                          style={{ paddingLeft: "8.5px", paddingTop: "7px" }}
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
                      <img
                        style={{
                          width: "230px",
                          opacity: "0.4",
                          height: "135px",
                          filter: "blur(3px)",
                        }}
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
                        alignItems: "center",
                        paddingLeft: "1rem",
                      }}
                    >
                      <div>
                        {" "}
                        <p>Video {selectedData?.name}</p>{" "}
                      </div>
                      <div>
                        <p
                          style={{
                            color: "#A7A6A6",
                          }}
                        >
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
        <div style={{ maxWidth: "1600px", margin: "auto" }}>
          {tokenData && (
            <Carousel
              itemWidth={"300px"}
              showDots={false}
              infinite={true}
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
                  // setSelectedToken={setSelectedToken}
                />
              ))}
            </Carousel>
          )}
        </div>
      </div>
      {/* ) */}
    </div>
  );
};

export default NftDataPageTest;
