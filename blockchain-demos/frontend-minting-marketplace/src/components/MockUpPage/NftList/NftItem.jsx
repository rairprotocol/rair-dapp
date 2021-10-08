import React, { useState } from "react";
import Modal from "react-modal";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import OfferItem from "./OfferItem";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
// import VideoList from "../../video/videoList";
import SelectBox from "../SelectBox/SelectBox";
// import 'react-accessible-accordion/dist/fancy-example.css';
Modal.setAppElement("#root");

const NftItem = ({
  price,
  pict,
  onClick,
  contract,
  collectionIndexInContract,
  primaryColor,
  textColor,
}) => {
  const [metadata, setMetadata] = useState([]);
  const [selected, setSelected] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  // debugger
  let subtitle;

  function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  function getIndexFromName(str) {
    return str.split("#").pop();
  }
  function onSelect(text) {
    const index = getIndexFromName(text);
    setSelected(metadata[index]);
  }

  function percentToRGB(percent) {
    // switch (percent){
    //   case (percent < 15):
    //     return "#95F619"
    //   case (15 < percent < 35):
    //   return '#F6ED19'
    //   case (35 <= percent <= 100):
    //     return '#F63419'
    //     default:
    //     return '0'
    // }
    if (percent) {
      if (percent < 15) {
        return "#95F619";
      } else if (15 <= percent && percent < 35) {
        return "#F6ED19";
      } else {
        return "#F63419";
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

  const minPrice = arrayMin(price);
  const maxPrice = arrayMax(price);

  // console.log([minPrice, "min", maxPrice, "max"]);
  // drop down end
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: `var(--${primaryColor})`,
      width: "100%",
      height: "95%",
      borderRadius: "16px",
      border: "none",
      zIndex: 20000,
      color: textColor,
    },
  };

  function toUpper(string) {
    if (string) {
      return string[0].toUpperCase() + string.slice(1);
    }
  }
  const responsive = {
    // superLargeDesktop: {
    //   breakpoint: { max: 4000, min: 3000 },
    //   items: 4,
    // },
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

  const getAllProduct = async () => {
    const responseAllProduct = await (
      await fetch(`/api/nft/${contract}/${collectionIndexInContract}`, {
        method: "GET",
      })
    ).json();

    const metadata = responseAllProduct.result.map((item) => item.metadata);
    // debugger;
    setMetadata(metadata);
    setSelected(metadata[0]);
  };

  function openModal() {
    setIsOpen(true);
    getAllProduct();
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "white";
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <button
        onClick={openModal}
        className="col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start video-wrapper"
        style={{
          height: "291px",
          width: "291px",
          border: "none",
          backgroundColor: "transparent",
        }}
      >
        <div
          className="col-12 rounded"
          style={{
            top: 0,
            position: "relative",
            height: "96%",
            pointerEvents: "none",
          }}
        >
          <img
            alt="thumbnail"
            src={pict}
            style={{ position: "absolute", bottom: 0, borderRadius: "16px" }}
            className="col-12 h-100 w-100"
          />
        </div>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2
          ref={(_subtitle) => (subtitle = _subtitle)}
          style={{
            // color: "white !Important",
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
          {selected?.name}
        </h2>
        <button
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
        </button>
        <div
          style={{
            maxWidth: "1600px",
            margin: "auto",
            backgroundColor: `var(--${primaryColor})`,
            borderRadius: "16px",
            padding: "24px 0",
          }}
        >
          <div
            onClick={onClick}
            style={{
              margin: "auto",
              backgroundImage: `url(${selected.image})`,
              width: "604px",
              // height: "394px",
              height: "45rem",
              backgroundPosition: "center",
              backgroundSize: "contain",
              // backgroundSize: "cover",
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
              alignItems: 'center',
            }}
          >
            <div>
              <span>Price range</span>
              <div
                style={{
                  // border: "1px solid red",
                  borderRadius: "16px",
                  padding: "10px",
                  width: "228px",
                  height: "48px",
                  backgroundColor: "#383637",
                }}
              >
                <span
                  style={{
                    paddingLeft: "1rem",
                    marginRight: "3rem",
                  }}
                >
                  {minPrice} – {maxPrice} ETH
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
                {/* <select>
                  <option>Ultra Rair 1/1</option>
                  <option>Rair 842 / 1,000</option>
                  <option>Common 1,620 / 10,000</option>
                </select> */}
                <SelectBox
                  primaryColor={primaryColor}
                  items={[
                    // { pkey: `🔑`, value: "Ultra Rair 1/1", id: 1 },
                    { pkey: `🔑`, value: "Rair", id: 2 },
                    // { pkey: `🔑`, value: "Common 1,620 / 10,000", id: 3 },
                  ]}
                />
              </div>
            </div>
            <div>
              <span>Serial number</span>
              <div>
                <SelectBox  primaryColor={primaryColor} selectItem={onSelect} items={metadata.length && metadata.map((e) =>{
                  return {value: e.name, id: getIndexFromName(e.name)}
                } )}>
                  {/* {metadata &&
                    metadata.map((e, index) => (
                      <option key={index}>{e.name}</option>
                    ))} */}
                </SelectBox>
              </div>
            </div>
            <div style={{
              marginTop:'18px'
            }}>
              <button
                style={{
                  width: "228px",
                  height: "48px",
                  border: "none",
                  borderRadius: "16px",
                  color: textColor,
                  backgroundImage:
                    "linear-gradient(96.34deg, #725BDB 0%, #805FDA 10.31%, #8C63DA 20.63%, #9867D9 30.94%, #A46BD9 41.25%, #AF6FD8 51.56%, #AF6FD8 51.56%, #BB73D7 61.25%, #C776D7 70.94%, #D27AD6 80.62%, #DD7ED6 90.31%, #E882D5 100%)",
                }}
              >
                Owned
              </button>
            </div>
          </div>
          <Accordion allowZeroExpanded>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Properties</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="col-12 row mx-0">
                  {Object.keys(selected).length &&
                    selected?.attributes.map((item, index) => {
                      if (item.trait_type === "External URL") {
                        return (
                          <div
                            key={index}
                            className="col-4 my-2 p-1 custom-desc-to-offer"
                            style={{ color: textColor, textAlign: "center" }}
                          >
                            <span>{item?.trait_type}:</span>
                            <br />
                            <a style={{ color: textColor }} href={item?.value}>
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
                    })}
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
                    {toUpper(selected?.artist)}
                  </div>
                  <div className="my-2 px-4 custom-desc-to-offer">
                    {selected?.description}
                  </div>
                  <div className="my-2 px-4 custom-desc-to-offer">
                    <a href={selected?.external_url}>
                      {selected?.external_url}
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
                  onClick={onClick}
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
                        src={selected.image}
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
                        <p>Video {selected?.name}</p>
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
          <Carousel
            itemWidth={"300px"}
            showDots={false}
            // infinite={true}
            responsive={responsive}
            itemClass="carousel-item-padding-4-px"
          >
            {metadata &&
              metadata.map((e, index) => (
                <OfferItem
                  key={index}
                  index={index}
                  metadata={metadata}
                  data={e}
                  setSelected={setSelected}
                />
              ))}
          </Carousel>
        </div>
      </Modal>
    </>
  );
};
export default NftItem;
