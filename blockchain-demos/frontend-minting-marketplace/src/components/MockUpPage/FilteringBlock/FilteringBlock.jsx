import React, { useState, useEffect, useRef } from 'react'

const FilteringBlock = ({ primaryColor, textColor }) => {
    const [filterPopUp, setFilterPopUp] = useState(false);
    const [filterItem, setFilterItem] = useState('Filters');
    const filterRef = useRef();

    const [sortPopUp, setSortPopUp] = useState(false);
    const [sortItem, setSortItem] = useState(<i class="fas fa-sort-amount-down-alt"></i>);
    const sortRef = useRef();

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
                    <div className="select-filters-title"><i class="fas fa-sliders-h"></i>{filterItem}</div>
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
                            {sortPopUp ? <i class="fas fa-chevron-up"></i> : <i class="fas fa-chevron-down"></i>}
                        </div>
                    </div>
                </div>
                {
                    sortPopUp && <div style={{
                        backgroundColor: `var(--${primaryColor})`,
                        color: `var(--${textColor})`
                    }}
                        className="select-sort-title-pop-up"
                        onClick={() => onChangeSortItem(<i class="fas fa-sort-amount-up"></i>)}
                    >
                        <div className="select-sort-item">
                            <i class="fas fa-sort-amount-up"></i>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default FilteringBlock
