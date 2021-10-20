import React, { useState, useEffect, useRef } from 'react';
import "./FilteringBlock.css";
import Modal from './modal';
import Portal from './portal';

const FilteringBlock = ({ primaryColor, textColor }) => {
    const [filterPopUp, setFilterPopUp] = useState(false);
    const [filterItem, setFilterItem] = useState('Filters');
    const filterRef = useRef();

    const [sortPopUp, setSortPopUp] = useState(false);
    const [sortItem, setSortItem] = useState(<i className="fas fa-sort-amount-down-alt"></i>);
    const sortRef = useRef();

    const [isOpen, setIsOpen] = React.useState(false);
    const categories = ['Music video', 'Art', 'Abstract', 'Interview', 'Course', '18+'];
    const [arrCategories, setArrCategories] = useState([]);

    const addCategories = (item) => {
        setArrCategories([...arrCategories, item]);
    }

    const onChangeFilterItem = (item) => {
        setFilterItem(item);
        onChangeFilterPopUp()
    }

    const onChangeFilterPopUp = () => {
        setFilterPopUp(prev => !prev);
    }

    const onChangeSortPopUp = () => {
        setSortPopUp(prev => !prev)
    }

    const onChangeSortItem = (item) => {
        setSortItem(item);
        onChangeSortPopUp()
    }

    const handleClickOutSideFilter = (e) => {
        if (!filterRef.current.contains(e.target)) {
            setFilterPopUp(false)
        }
    }

    const handleClickOutSideSort = (e) => {
        if (!sortRef.current.contains(e.target)) {
            setSortPopUp(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutSideFilter);
        return () => document.removeEventListener('mousedown', handleClickOutSideFilter);
    })

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutSideSort);
        return () => document.removeEventListener('mousedown', handleClickOutSideSort);
    })

    return (
        <>
            <div ref={filterRef} className="select-filters-wrapper">
                <div
                    style={{
                        backgroundColor: `var(--${primaryColor})`,
                        color: `var(--${textColor})`
                    }}
                    className="select-filters"
                    onClick={onChangeFilterPopUp}
                >
                    <div className="select-filters-title"><i className="fas fa-sliders-h"></i>Filters</div>
                </div>

                {
                    filterPopUp && <div style={{
                        backgroundColor: `var(--${primaryColor})`,
                        color: `var(--${textColor})`
                    }} className="select-filters-popup">
                        <div onClick={() => onChangeFilterItem("Price")} className="select-filters-item">Price</div>
                        <div onClick={() => onChangeFilterItem("Creator")} className="select-filters-item">Creator</div>
                        <div onClick={() => { onChangeFilterItem("Metadata"); setIsOpen(true) }} className="select-filters-item">Categories</div>
                    </div>
                }
            </div>
            <div ref={sortRef} className="select-sort-wrapper">
                <div
                    onClick={onChangeSortPopUp}
                    style={{
                        backgroundColor: `var(--${primaryColor})`,
                        color: `var(--${textColor})`
                    }}
                    className="select-sort"
                >
                    <div className="select-sort-title">
                        <div className="title-left">
                            {sortItem}Sort by name
                        </div>
                        <div className="title-right-arrow">
                            {sortPopUp ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                        </div>
                    </div>
                </div>
                {
                    sortPopUp && <div style={{
                        backgroundColor: `var(--${primaryColor})`,
                        color: `var(--${textColor})`
                    }}
                        className="select-sort-title-pop-up"
                        onClick={() => onChangeSortItem(<i className="fas fa-sort-amount-up"></i>)}
                    >
                        <div className="select-sort-item">
                            <i className="fas fa-sort-amount-up"></i>
                        </div>
                    </div>
                }
                <Modal
                    onClose={() => {
                        setIsOpen(false);
                    }}
                    open={isOpen}
                >
                    <div className="modal-content-metadata">
                        <div className="block-close">
                            <button onClick={() => setIsOpen(false)}>
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-filtering">
                            <div className="categories-wraper">
                                <div className="modal-filtering-title">
                                    <h4>Categories</h4>
                                </div>
                                <div className="filtering-categories">
                                    {
                                        categories.map((c) => {
                                            return <button onClick={() => {addCategories(c)}}>{c}</button>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="price-wrapper">
                                <div className="modal-filtering-price-title">
                                    <h4>Price</h4>
                                </div>
                                <div className="filtering-price">
                                    <div className="select-price">
                                        <span>Ethereum(ETH)</span>
                                        <span className="price-arrow"><i class="fas fa-chevron-down"></i></span>
                                    </div>
                                    <div className="block-min-max">
                                        <input type="text" placeholder="Min" />
                                        <span>to</span>
                                        <input type="text" placeholder="Max" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="modal-filtering-btn">
                            <button>Clear All</button>
                            <button>Apply</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default FilteringBlock
