//@ts-nocheck
import React, { useCallback } from "react";
import { SvgKeyForModalItem } from "../../../NftList/SvgKeyForModalItem";
import Modal from "../../modal";
import "./ModalItemResponsive.css";

const ModalItem = ({
  isOpenBlockchain,
  setIsOpenBlockchain,
  selectedData,
  defaultImg,
  primaryColor,
}) => {
  ;

  const onCloseModal = useCallback(() => {
    setIsOpenBlockchain(false);
  }, [setIsOpenBlockchain])

  function bidFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Modal style={{ height: "auto !important" }} onClose={onCloseModal} open={isOpenBlockchain}>
      <div className="modal-content-metadata">
        <div className="block-close">
          <button onClick={onCloseModal}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-main-content">
          <div
            className="bg-my-items p-2"
            style={{
              backgroundImage: `url(${selectedData?.metadata.image || defaultImg
                })`,
              backgroundColor: `var(--${primaryColor}-transparent)`,
            }}
          ></div>
          <div
            className="modal-number-tokenContent">
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
          {true && <>
            {/* <div className="filtering-price">
              <select className="select-price">
                <option value="0">Select network</option>
                <option value="1">Ethereum(ETH)</option>
                <option value="2">Bitcoin(BTC)</option>
              </select>
            </div>
            <button className="modal-item-footer-price">Price</button> */}
            <div>
              <button>Sell</button>
              {/* <Link
                to={`/token/${selectedData.contract}/${selectedData.uniqueIndexInContract}`}
                className="btn btn-stimorol modal-item-footer-view-token"
              >
                View Token
              </Link> */}
            </div>
          </>}
        </div>
      </div>
    </Modal>
  );
};

export default ModalItem;
