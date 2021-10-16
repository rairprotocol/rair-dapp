import React, { useState, useEffect } from "react";
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
import chainData from "../../../utils/blockchainData";
// import 'react-accessible-accordion/dist/fancy-example.css';
import { useLocation, useParams, useHistory } from "react-router-dom";

Modal.setAppElement("#root");

const NftItem = ({
  blockchain,
  price,
  pict,
  onClick,
  contractName,
  collectionIndexInContract,
  primaryColor,
  textColor,
  collectionName,
  ownerCollectionUser,
}) => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const { adminToken, contract, product, token } = params;
  let subtitle;

  const [allProducts, setAllProducts] = useState([]);
  const [selected, setSelected] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState();
  // const [hover, setHover] = useState(false);
  // const [dataImg, setDataImg] = useState();

  // useEffect(()=>{
  //   if(dataLoaded ===true) {
  //     setSelected(allProducts[0].metadata);
  //   }
  // },[dataLoaded,setSelected,allProducts])

  const getData = async () => {
    if (adminToken && contract && product) {
      const response = await (
        await fetch(`/api/${adminToken}/${contract}/${product}`, {
          method: "GET",
        })
      ).json();
      const data = response.result?.tokens.find(
        (data) => String(data.token) === token
      );

      setSelectedToken(data.token);
      return data;
    } else return null;
  };

  const getAllProduct = async () => {
    const responseAllProduct = await (
      await fetch(`/api/nft/${contractName}/${collectionIndexInContract}`, {
        method: "GET",
      })
    ).json();

    setAllProducts(responseAllProduct.result);

    if (!Object.keys(params).length)
      setSelected(responseAllProduct.result[0].metadata);
  };

  const waitResponse = async () => {
    const data = await getData();
    if (data && data.metadata) {
      setSelected(data.metadata);
      openModal();
    }
  };

  const handleClick1 = () => {
    history.push(`/tokens/${contractName}/${collectionIndexInContract}/0`);
  };
  function openModalOnClick() {
    openModal();
    handleClick1();
  }
  function openModal() {
    setIsOpen(true);
    getAllProduct();
  }

  const handelClickToken = (token) => {
    history.push(
      `/tokens/${contractName}/${collectionIndexInContract}/${token}`
    );
    setSelectedToken(token);
  };
  useEffect(() => {
    waitResponse();
  }, []);

  function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  function onSelect(id) {
    allProducts.forEach((p) => {
      if (p._id === id) {
        setSelected(p.metadata);
      }
    });
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
  // (function () {
  //   let angle = 0;
  //   let p = document.querySelector('p');
  //   debugger
  //   if(p){
  //     let text = p.textContent.split('');
  //     var len = text.length;
  //     var phaseJump = 360 / len;
  //     var spans;
  //     p.innerHTML = text.map(function (char) {
  //       return '<span>' + char + '</span>';
  //     }).join('');
    
  //     spans = p.children;
  //   }
  //   else console.log('kik');
  
  //   (function wheee () {
  //     for (var i = 0; i < len; i++) {
  //       spans[i].style.color = 'hsl(' + (angle + Math.floor(i * phaseJump)) + ', 55%, 70%)';
  //     }
  //     angle++;
  //     requestAnimationFrame(wheee);
  //   })();
  // })();
  
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "white";
  }
  function handleClick() {
    history.push("/all");
  }

  function closeModal() {
    setIsOpen(false);
    handleClick();
  }
  return (
    <>
      <button
        onClick={openModalOnClick}
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
        <div className="col description-wrapper pic-description-wrapper">
          <span className="description-title">
            {collectionName}
            <br />
          </span>
          <span className="description">
            {ownerCollectionUser.slice(0, 7)}
            {ownerCollectionUser.length > 10 ? "..." : ""}
            <br></br>
          </span>
          <div className="description-small" style={{ paddingRight: "16px" }}>
            <img
              className="blockchain-img"
              src={`${chainData[blockchain]?.image}`}
              alt=""
            />
            <span className="description ">{minPrice} ETH </span>
          </div>
          <div className="description-big">
            <img
              className="blockchain-img"
              src={`${chainData[blockchain]?.image}`}
              alt=""
            />
            <span className="description description-price">
              {minPrice} - {maxPrice} ETH{" "}
            </span>
            <span className="description-more">View item</span>
          </div>
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
        {/* <p className='rainbow-text'>RAIR</p> */}
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
              backgroundImage: `url(${selected?.image || pict})`,
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
                  src={`${chainData[blockchain]?.image}`}
                  alt=""
                />
                <span
                  style={{
                    paddingLeft: "9px",
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
                <SelectBox
                  handelClickToken={handelClickToken}
                  selectedToken={selectedToken}
                  contractName={contractName}
                  primaryColor={primaryColor}
                  selectItem={onSelect}
                  items={
                    allProducts.length &&
                    allProducts.map((p) => {
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
                  {selected
                    ? Object.keys(selected).length &&
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
                        src={selected?.image}
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
            {allProducts &&
              allProducts.map((p, index) => (
                <OfferItem
                  key={index}
                  index={index}
                  metadata={p.metadata}
                  token={p.token}
                  handelClickToken={handelClickToken}
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
