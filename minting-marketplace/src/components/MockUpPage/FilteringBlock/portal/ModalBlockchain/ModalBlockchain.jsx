import React, { useState } from "react";
import Modal from "../../modal";
import BlockMinMax from "../BlockMinMax/BlockMinMax";

const blockchains = [
  {
    name: "Matic Mainnet",
    chainId: "0x89",
    clicked: false,
  },
  {
    name: "Matic Testnet",
    chainId: "0x13881",
    clicked: false,
  },
  {
    name: "Goerli Testnet",
    chainId: "0x5",
    clicked: false,
  },
  {
    name: "Binance Testnet",
    chainId: "0x61",
    clicked: false,
  },
  {
    name: "Binance Mainnet",
    chainId: "0x38",
    clicked: false,
  },
  {
    name: "Ethereum Mainnet",
    chainId: "0x1",
    clicked: false,
  },
  // {
  //   name: "Ropsten",
  //   chainId: "0x3",
  //   clicked: false,
  // },
  // {
  //   name: "Klaytn",
  //   chainId: "0x3e9",
  //   clicked: false,
  // },
];

const ModalBlockchain = ({
  setBlockchain,
  isOpenBlockchain,
  setIsOpenBlockchain,
  getContract,
}) => {
  const [arrBlockchains, setArrBlockchains] = useState(blockchains);
  const [clearAll, setClearAll] = useState(false);
  // const [click, setClick] = useState(false);

  const onChangeClicked = (name) => {
    // const onChangeClicked = () => {
    // setClick(!click);
    // console.log(name, 'name');
    const updatedBlockchains = arrBlockchains.map((bch, index) => {
      if (name === bch.name) {
        return {
          ...bch,
          clicked: !bch.clicked,
        };
      } else {
        return {
          ...bch,
          clicked: bch.clicked,
        };
      }
    });
    setClearAll(false);
    setArrBlockchains(updatedBlockchains);
    // console.log(updatedBlockchains, 'updatedBlockchains');
  };

  const clearAllFilters = () => {
    const clearArrBlockchains = arrBlockchains.map((cat) => {
      return {
        ...cat,
        clicked: false,
      };
    });
    setBlockchain(null);
    setArrBlockchains(clearArrBlockchains);
    setClearAll(true);
  };

  const onCloseModal = () => {
    setIsOpenBlockchain(false);
    // clearAllFilters();
    setClearAll(true);
  };

  // const onClickApply = () => {

  // }

  return (
    <Modal onClose={onCloseModal} open={isOpenBlockchain}>
      <div className="modal-content-metadata">
        <div className="block-close">
          <button onClick={onCloseModal}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-filtering">
          <div className="price-wrapper">
            <div className="modal-filtering-price-title">
              <h4>Price</h4>
            </div>
            <div className="filtering-price">
              <select className="select-price">
                <option value="0">Select</option>
                <option value="1">Ethereum(ETH)</option>
                <option value="2">Bitcoin(BTC)</option>
                {/* <span className="price-arrow"><i className="fas fa-chevron-down"></i></span> */}
              </select>
              <BlockMinMax clearAll={clearAll} />
            </div>
          </div>
          <div className="categories-wraper">
            <div className="modal-filtering-title">
              <h4>Blockchain</h4>
            </div>
            <div className="filtering-categories">
              {arrBlockchains.map((c) => {
                return (
                  <button
                    className={`${c.clicked ? "categories-clicked" : ""}`}
                    // className={`${click ? "categories-clicked" : ""}`}
                    key={c.name}
                    onClick={() => {
                      onChangeClicked(c.name);
                      setBlockchain(c.chainId);
                    }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <hr />
        <div className="modal-filtering-btn">
          <button onClick={clearAllFilters}>Clear All</button>
          <button
            onClick={() => {
              getContract();
              onCloseModal();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalBlockchain;
