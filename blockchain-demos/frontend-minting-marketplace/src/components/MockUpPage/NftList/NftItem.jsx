import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import OfferItem from "./OfferItem";
Modal.setAppElement("#root");

const NftItem = ({ pict, onClick, contract, collectionIndexInContract }) => {
  const [metadata, setMetadata] = useState([]);
  const [selected, setSelected] = useState({});
  // const [attributes, setAttributes] = useState([]);
  // const [existingMetadataArray, setExistingMetadataArray] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);

  let subtitle;

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#222021",
      width: "100%",
      height: "95%",
      borderRadius: "16px",
      border: "none",
      zIndex: 20000,
      color: "white",
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

    // let sortedMetadataArray = [];
    // for await (let token of responseAllProduct.result) {
    //   sortedMetadataArray[token.token] = token.metadata;
    // }
    // setExistingMetadataArray(sortedMetadataArray);

    const metadata = responseAllProduct.result.map((item) => item.metadata);
    setMetadata(metadata);
    setSelected(metadata[0]);
  };

  // useEffect(() => {
  //   if (existingMetadataArray.length) {
  //     let metadataArray = existingMetadataArray[collectionIndexInContract];
  //     setAttributes(
  //       Object.keys(metadataArray.attributes).map((item, index) => {
  //         let itm = metadataArray.attributes[item];
  //         if (itm.trait_type === undefined) {
  //           if (Object.keys(metadataArray.attributes[item]).length === 1) {
  //             itm = {
  //               trait_type: item,
  //               value: metadataArray.attributes[item],
  //             };
  //           }
  //           itm = {
  //             trait_type: item,
  //             value: metadataArray.attributes[item],
  //           };
  //         }
  //         return itm;
  //       })
  //     );
  //   }
  // }, [collectionIndexInContract, existingMetadataArray]);

  function openModal() {
    setIsOpen(true);
    getAllProduct();
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "white";
  }
  // function renderPic(e) {
  // setSelected(e)
  // setAttributes(e)
  // }
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
            color: "white !Important",
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
            backgroundColor: "#383637",
            borderRadius: "16px",
            padding: "24px 0",
          }}
        >
          <div
            onClick={onClick}
            style={{
              margin: "auto",
              backgroundImage: `url(${selected.image})`,
              width: "702px",
              height: "394px",
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="custom-desc-to-offer-wrapper">
            <div
              className="custom-desc-to-offer"
              style={
                {
                  // border: "1px solid red",
                  // backgroundColor: "rgba(255, 34, 34, 0.667)",
                  // borderRadius: "20px",
                }
              }
            >
              {toUpper(selected?.artist)}
            </div>
            <div
              className="custom-desc-to-offer"
              style={
                {
                  // border: "1px solid red",
                  // backgroundColor: "rgba(255, 34, 34, 0.667)",
                  // borderRadius: "20px",
                }
              }
            >
              {/* selected metadata.description */}
              {selected?.description}
            </div>
            <div
              className="custom-desc-to-offer"
              style={
                {
                  // border: "1px solid red",
                  // backgroundColor: "rgba(255, 34, 34, 0.667)",
                  // borderRadius: "20px",
                }
              }
            >
              {selected?.external_url}
            </div>
          </div>
          {/* <div className="col-12 row px-0 mx-0"> */}
          <div className="col-12 row px-0 mx-0">
            {Object.keys(selected).length &&
              selected?.attributes.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="col-4 my-2 p-1 custom-desc-to-offer"
                  >
                    <div style={{padding: '0.1rem 1rem', textAlign: 'center'}}>
                      <span>{item?.trait_type}:</span>{" "}
                      <span style={{ color: "#95F619" }}>{item?.value}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div style={{ maxWidth: "1600px", margin: "auto" }}>
          <Carousel
            itemWidth={"300px"}
            showDots={false}
            infinite={true}
            responsive={responsive}
            itemClass="carousel-item-padding-40-px"
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
