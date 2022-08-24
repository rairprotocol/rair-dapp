import React, { useState } from 'react';
import {
  IModalBlockchain,
  TBlockchainCategory,
  TBlockchainNames
} from '../../filteringBlock.types';
import Modal from '../../modal';

const blockchains: TBlockchainCategory[] = [
  {
    name: 'Matic Mainnet',
    chainId: '0x89',
    clicked: false
  },
  {
    name: 'Matic Testnet',
    chainId: '0x13881',
    clicked: false
  },
  {
    name: 'Goerli Testnet',
    chainId: '0x5',
    clicked: false
  },
  {
    name: 'Binance Testnet',
    chainId: '0x61',
    clicked: false
  },
  {
    name: 'Binance Mainnet',
    chainId: '0x38',
    clicked: false
  },
  {
    name: 'Ethereum Mainnet',
    chainId: '0x1',
    clicked: false
  }
];

const ModalBlockchain: React.FC<IModalBlockchain> = ({
  setBlockchain,
  isOpenBlockchain,
  setIsOpenBlockchain,
  setIsShow,
  setFilterText,
  click,
  setClick
}) => {
  const [arrBlockchains /*setArrBlockchains*/] = useState(blockchains);
  const [, /*clearAll*/ setClearAll] = useState<boolean>(false);

  const onChangeClicked = (name: TBlockchainNames) => {
    setClick?.(name);

    setClearAll(false);
    setIsShow?.(true);
    setFilterText?.(name);
  };

  const clearAllFilters = () => {
    setBlockchain?.(undefined);
    setClearAll(true);
    setIsShow?.(false);
    setClick?.(null);
  };

  const onCloseModal = () => {
    setIsOpenBlockchain(false);
    setClearAll(true);
    // clearAllFilters();
  };

  const onClickApply = () => {
    // getContract();
    onCloseModal();
  };

  const onClickButton = (data) => {
    onChangeClicked(data.name);
    setBlockchain?.(data.chainId);
  };

  return (
    <Modal onClose={onCloseModal} open={isOpenBlockchain}>
      <div className="modal-content-metadata">
        <div className="block-close">
          <button className="modal-content-close" onClick={onCloseModal}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-filtering">
          <div className="price-wrapper">
            {/* <div className="modal-filtering-price-title">
              <h4>Price</h4>
            </div> */}
            {/* <div className="filtering-price">
              <select className="select-price">
                <option value="0">Select</option>
                <option value="1">Ethereum(ETH)</option>
                <option value="2">Bitcoin(BTC)</option> */}
            {/* <span className="price-arrow">
                    <i className="fas fa-chevron-down"></i>
                  </span> */}
            {/* </select>
              <BlockMinMax clearAll={clearAll} />
            </div> */}
          </div>
          <div className="categories-wraper">
            <div className="modal-filtering-title">
              <h4>Blockchain</h4>
            </div>
            <div className="filtering-categories">
              {arrBlockchains.map((blockchainFromArray) => {
                return (
                  <button
                    className={`${
                      click === blockchainFromArray.name
                        ? 'categories-clicked'
                        : ''
                    }`}
                    // className={`${click ? "categories-clicked" : ""}`}
                    key={blockchainFromArray.name}
                    onClick={() => {
                      onClickButton(blockchainFromArray);
                    }}>
                    {blockchainFromArray.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <hr />
        <div className="modal-filtering-btn">
          <button
            className="modal-filtering-clear-btn"
            onClick={() => clearAllFilters()}>
            Clear
          </button>
          <button
            className="modal-filtering-apply-btn"
            onClick={() => {
              onClickApply();
            }}>
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalBlockchain;

//unused-snippet 1
// const updatedBlockchains = arrBlockchains.map((bch, index) => {
//   if (name === bch.name) {
//     return {
//       ...bch,
//       clicked: !bch.clicked,
//     };
//   } else {
//     return {
//       ...bch,
//       clicked: bch.clicked,
//     };
//   }
// });
// setArrBlockchains(updatedBlockchains);

//unused-snippet 2
// const clearArrBlockchains = arrBlockchains.map((cat) => {
//   return {
//     ...cat,
//     clicked: false,
//   };
// });
// setArrBlockchains(clearArrBlockchains);

//unused-snippet 3
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
