import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SvgKeyForModalItem } from "../../../NftList/SvgKeyForModalItem";
import Modal from "../../modal";

const ModalItem = ({
  isOpenBlockchain,
  setIsOpenBlockchain,
  selectedData,
  defaultImg,
  primaryColor,
}) => {
  const [ /*clearAll*/ , setClearAll ] = useState(false);

  console.log(selectedData, "selectedData");

  const onCloseModal = () => {
    setIsOpenBlockchain(false);
    setClearAll(true);
  };

  function bidFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Modal onClose={onCloseModal} open={isOpenBlockchain}>
      <div className="modal-content-metadata">
        <div className="block-close">
          <button onClick={onCloseModal}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div style={{ display: "flex", paddingLeft: "32px" }}>
          <div
            className="w-100 bg-my-items p-2"
            style={{
              maxWidth: "291px",
              height: "291px",
              backgroundImage: `url(${
                selectedData?.metadata.image || defaultImg
              })`,
              backgroundColor: `var(--${primaryColor}-transparent)`,
              overflow: "hidden",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              paddingLeft: "32px",
            }}
          >
            <span className="modal-item-title">
              {bidFirstLetter(selectedData.title)}
            </span>
            <span className="modal-item-user">{selectedData.user}</span>
            <div style={{ display: "flex" }}>
              <SvgKeyForModalItem />
              <span className="modal-item-token description">
                Token : {selectedData.token}
              </span>
            </div>
          </div>
        </div>
        <hr />
        <div className="modal-item-footer-wrapper modal-filtering-btn">
          <div className="filtering-price">
            <select className="select-price">
              <option value="0">Select network</option>
              <option value="1">Ethereum(ETH)</option>
              <option value="2">Bitcoin(BTC)</option>
            </select>
          </div>
          <button className="modal-item-footer-price">Price</button>
          <div style={{ marginLeft: "auto" }}>
            <Link
              to={`/token/${selectedData.contract}/${selectedData.uniqueIndexInContract}`}
              className="btn btn-stimorol modal-item-footer-view-token"
            >
              View Token
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalItem;
