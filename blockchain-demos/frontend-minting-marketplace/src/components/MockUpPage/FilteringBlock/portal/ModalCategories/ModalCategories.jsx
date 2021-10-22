import React, { useState } from 'react'
import Modal from '../../modal';
import BlockMinMax from '../BlockMinMax/BlockMinMax';

const categories = [{
    name: 'Music video',
    clicked: false
},
{
    name: 'Art',
    clicked: false,
},
{
    name: 'Abstract',
    clicked: false
},
{
    name: 'Interview',
    clicked: false
},
{
    name: 'Course',
    clicked: false
},
{
    name: '18+',
    clicked: false
}];

const ModalCategories = ({ setIsOpenCategories, isOpenCategories }) => {
    const [arrCategories, setArrCategories] = useState(categories);
    const [clearAll, setClearAll] = useState(false);

    const clearAllFilters = () => {
        const clearArrCategories = arrCategories.map((cat) => {
            return {
                ...cat,
                clicked: false
            }
        })
        setArrCategories(clearArrCategories);
        setClearAll(true);
    }

    const onChangeClicked = (name) => {
        const updatedCateg = arrCategories.map((cat, index) => {
            if (name === cat.name) {
                return {
                    ...cat,
                    clicked: !cat.clicked
                }
            }
            else {
                return {
                    ...cat
                }
            }
        })
        setClearAll(false)
        setArrCategories(updatedCateg);
    }

    const onCloseModal = () => {
        setIsOpenCategories(false);
        clearAllFilters()
        setClearAll(true);
    }

    return (
        <Modal
            onClose={onCloseModal}
            open={isOpenCategories}
        >
            <div className="modal-content-metadata">
                <div className="block-close">
                    <button onClick={onCloseModal}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-filtering">
                    <div className="categories-wraper">
                        <div className="modal-filtering-title">
                            <h4>Categories</h4>
                        </div>
                        <div className="filtering-categories">
                            {
                                arrCategories.map((c) => {
                                    return <button className={`${c.clicked ? "categories-clicked" : ''}`} key={c.name} onClick={() => onChangeClicked(c.name)}>{c.name}</button>
                                })
                            }
                        </div>
                    </div>
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

export default ModalCategories
