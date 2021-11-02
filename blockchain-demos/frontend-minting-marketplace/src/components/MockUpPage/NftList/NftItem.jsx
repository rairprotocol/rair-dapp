import React, { useState, useCallback, useEffect } from "react";
import Modal from "react-modal";
import "react-multi-carousel/lib/styles.css";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { SvgKey } from "./SvgKey";
import chainDataFront from "../utils/blockchainDataFront";
import ReactPlayer from 'react-player';

// import Swal from 'sweetalert2';
// import 'react-accessible-accordion/dist/fancy-example.css';
// import VideoList from "../../video/videoList";

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
  allData: dataVerification,
}) => {
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();
  const params = useParams();
  const { adminToken, contract, product, token, offer } = params;
  // eslint-disable-next-line no-unused-vars
  let subtitle;

  const [metaDataProducts, setMetaDataProducts] = useState();
  const [playing, setPlaying] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [selected, setSelected] = useState({});
  const [selectedToken, setSelectedToken] = useState();
  const [modalIsOpen, setIsOpen] = useState(
    // () =>
    // contract === dataVerification?.title &&
    // product === dataVerification?.name &&
    // dataVerification.offerData.some((item) => item.offerName === offer)
  );

  const handlePlaying = () => {
    setPlaying(prev => !prev);
  }

  // const getData = useCallback(async () => {
  //   if (adminToken && contract && product) {
  //     const response = await (
  //       await fetch(`/api/${adminToken}/${contract}/${product}`, {
  //         method: "GET",
  //       })
  //     ).json();
  //     const data = response.result?.tokens.find(
  //       (data) => String(data.token) === token
  //     );
  //     return data;
  //   } else return null;
  // }, [adminToken, contract, product, token]);

  // const getAllProduct = useCallback(async () => {
  //   const responseAllProduct = await (
  //     await fetch(`/api/nft/${contractName}/${collectionIndexInContract}`, {
  //       method: "GET",
  //     })
  //   ).json();

  //   setAllProducts(responseAllProduct.result);

  //   if (!Object.keys(params).length)
  //     setSelected(responseAllProduct.result[0].metadata);
  // }, [collectionIndexInContract, contractName, params]);

  const getProductAsync = async () => {
    const responseProductMetadata = await (
      await fetch(`/api/nft/${contractName}/${collectionIndexInContract}`, {
        method: "GET",
      })
    ).json();
    if (responseProductMetadata.result.length > 0) {
      // console.log(responseProductMetadata.result[0])
      setMetaDataProducts(responseProductMetadata.result[0]);
    }
    // setMetaDataProducts(responseProductMetadata);
  }

  useEffect(() => {
    getProductAsync();
  }, [])

  const openModal = useCallback(() => {
    setIsOpen(true);
    // console.log('open');
    // getAllProduct();
  },
    // [getAllProduct]
  );

  function openModalOnClick() {
    openModal();
    redirection();
    // handleClickToken();
  }

  // const waitResponse = useCallback(async () => {
  // const data = await getData();
  // if (data && data.metadata) {
  // setSelected(data.metadata);
  // setSelectedToken(data.token);
  // openModal();
  // }
  // }, [getData, openModal, setSelected]);

  const redirection = () => {
    history.push(`/tokens/${contractName}/${collectionIndexInContract}/0`);
    // console.log(dataVerification, 'dataVerification');
    // console.log(dataVerification.offerData[0].productNumber, 'dataVerification.offerData[0].productNumber');
    // history.push(`/${0}/${dataVerification.title}/${dataVerification.name}/${dataVerification.offerData[0].offerName}/${dataVerification.offerData[0].productNumber}`)
  };

  const handleClickToken = (token) => {
    history.push(
      `/tokens/${contractName}/${collectionIndexInContract}/${token}`
    );
    setSelectedToken(token);
  };

  // useEffect(() => {
  // if (modalIsOpen) {
  // waitResponse();
  // }
  // }, [modalIsOpen, waitResponse]);

  function onSelect(id) {
    allProducts.forEach((p) => {
      if (p._id === id) {
        setSelected(p.metadata);
      }
    });
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


  function handleClick() {
    history.push("/all");
  }

  function closeModal() {
    setIsOpen(false);
    handleClick();
  }

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

  return (
    <>
      <div
        // onClick={openModalOnClick}
        className="col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start video-wrapper"
        style={{
          height: "291px",
          width: "291px",
          border: "none",
          backgroundColor: "transparent",
          overflow: "hidden",
        }}
      >
        <div
          className="col-12 rounded"
          style={{
            top: 0,
            position: "relative",
            height: "96%",
            // pointerEvents: "none",
          }}
        >
          {
            metaDataProducts?.metadata?.animation_url && <div onClick={handlePlaying} className="btn-play">
              {
                playing ? <div><i className="fas fa-pause"></i></div> : <div>
                  <i className="fas fa-play"></i>
                </div>
              }
            </div>
          }
          {metaDataProducts?.metadata?.animation_url ? <div style={{
            borderRadius: "16px",
            overflow: "hidden"
          }}>
            <ReactPlayer
              alt="thumbnail"
              url={`${metaDataProducts.metadata?.animation_url}`}
              light={metaDataProducts.metadata?.image ? metaDataProducts.metadata?.image : pict}
              style={{ position: "absolute", bottom: 0, borderRadius: "16px", overflow: "hidden" }}
              className="col-12 h-100 w-100"
              onReady={handlePlaying}
              playing={playing}
            />
          </div> : <img
            alt="thumbnail"
            src={pict}
            src={`${pict}`}
            style={{ position: "absolute", bottom: 0, borderRadius: "16px" }}
            className="col-12 h-100 w-100"
          />}
          {<SvgKey />}
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
              src={`${chainDataFront[blockchain]?.image}`}
              alt=""
            />
            <span className="description ">{minPrice} ETH </span>
          </div>
          <div onClick={openModalOnClick} className="description-big">
            <img
              className="blockchain-img"
              src={`${chainDataFront[blockchain]?.image}`}
              alt=""
            />
            <span className="description description-price">
              {minPrice} - {maxPrice} ETH{" "}
            </span>
            <span className="description-more">View item</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default NftItem;