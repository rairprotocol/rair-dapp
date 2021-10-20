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
                        <div onClick={() => onChangeFilterItem("Metadata")} className="select-filters-item">Metadata</div>
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
                <button
                    onClick={() => {
                        setIsOpen(true);
                    }}
                >
                    Open Modal
                </button>
                <Modal
                    onClose={() => {
                        setIsOpen(false);
                    }}
                    open={isOpen}
                >
                    <p>I'm a modal window, I use portal so I only exist when I'm open.</p>
                    <p>
                        Also tabbing is locked inside me go ahead and try tabbing to the
                        button behind me.
                    </p>
                    <p style={{ textAlign: "center" }}>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            Close
                        </button>
                    </p>
                </Modal>
            </div>
        </>
    )
}

export default FilteringBlock
