import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppSelector } from '../../../../../hooks/useReduxHooks';
import { IModalBlockchain, TBlockchainNames } from '../../filteringBlock.types';
import Modal from '../../modal';

const ModalBlockchain: React.FC<IModalBlockchain> = ({
  setBlockchain,
  isOpenBlockchain,
  setIsOpenBlockchain,
  setIsShow,
  setFilterText,
  click,
  setClick
}) => {
  const { blockchainSettings } = useAppSelector((store) => store.settings);
  const [arrBlockchains /*setArrBlockchains*/] = useState(
    blockchainSettings.map((chain) => {
      return {
        name: chain.name,
        chainId: chain.hash,
        clicked: false
      };
    })
  );
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
            <FontAwesomeIcon icon={faTimes} />
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
                    <FontAwesomeIcon icon={faChevronDown}/>
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
                    {blockchainFromArray.name} aa
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
