import React, { useState } from 'react'
import Modal from '../../modal';

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
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');

    const onChangeMin = (e) => {
        setMinValue(e.target.value)
    }

    const onChangeMax = (e) => {
        console.log(e.target.value);
    }

    const [arrCategories, setArrCategories] = useState(categories);

    const clearAllFilters = () => {
        const clearArrCategories = arrCategories.map((cat) => {
            return {
                ...cat,
                clicked: false
            }
        })
        setArrCategories(clearArrCategories);
        setMaxValue('');
        setMinValue('');
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
        setArrCategories(updatedCateg);
    }

    const onCloseModal = () => {
        setIsOpenCategories(false);
        clearAllFilters()
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
                                <option>Ethereum(ETH)</option>
                                <option>Bitcoin(BTC)</option>
                                {/* <span className="price-arrow"><i className="fas fa-chevron-down"></i></span> */}
                            </select>
                            <div className="block-min-max">
                                <input name="minValue" onChange={onChangeMin} type="text" placeholder="Min" />
                                <span>to</span>
                                <input value={maxValue} onChange={(e) => onChangeMax(e)} type="text" placeholder="Max" />
                            </div>
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
