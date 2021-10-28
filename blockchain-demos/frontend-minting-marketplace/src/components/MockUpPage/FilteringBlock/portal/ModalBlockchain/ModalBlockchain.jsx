import React, { useState } from 'react'
import Modal from '../../modal';
import BlockMinMax from '../BlockMinMax/BlockMinMax';

const blockchains = [{
    name: 'ERC',
    clicked: false
},
{
    name: 'BSC',
    clicked: false,
},
{
    name: 'OMNI',
    clicked: false
},
{
    name: 'BTC',
    clicked: false
}];

const ModalBlockchain = ({ isOpenBlockchain, setIsOpenBlockchain }) => {
    const [arrBlockchains, setArrBlockchains] = useState(blockchains);
    const [clearAll, setClearAll] = useState(false);

    const onChangeClicked = (name) => {
        const updatedBlockchains = arrBlockchains.map((bch, index) => {
            if (name === bch.name) {
                return {
                    ...bch,
                    clicked: !bch.clicked
                }
            }
            else {
                return {
                    ...bch
                }
            }
        })
        setClearAll(false);
        setArrBlockchains(updatedBlockchains);
    }

    const clearAllFilters = () => {
        const clearArrBlockchains = arrBlockchains.map((cat) => {
            return {
                ...cat,
                clicked: false
            }
        })
        setArrBlockchains(clearArrBlockchains);
        setClearAll(true)
    }

    const onCloseModal = () => {
        setIsOpenBlockchain(false);
        clearAllFilters();
        setClearAll(true);
    }

    const onClickApply = () => {
        
    }

    return (
        <Modal
            onClose={onCloseModal}
            open={isOpenBlockchain}
        >
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
                                <option value="2" >Bitcoin(BTC)</option>
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
                            {
                                arrBlockchains.map((c) => {
                                    return <button className={`${c.clicked ? "categories-clicked" : ''}`} key={c.name} onClick={() => onChangeClicked(c.name)}>{c.name}</button>
                                })
                            }
                        </div>
                    </div>
                </div>
                <hr />
                <div className="modal-filtering-btn">
                    <button onClick={clearAllFilters}>Clear All</button>
                    <button>Apply</button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalBlockchain
