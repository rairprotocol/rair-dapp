import React, { useRef, useState, useEffect } from 'react';
import "./SelectNumber.css"

const SelectNumber = ({items}) => {
    const [selectedItem, setSelectedItem] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const numberRef = useRef();

    const handleIsOpen = () => {
        setIsOpen(prev => !prev);
    }

    const onClickItem = (el) => {
        setSelectedItem(el);
        handleIsOpen()
    }

    const handleClickOutSideNumberItem = (e) => {
        if (!numberRef.current.contains(e.target)) {
            setIsOpen(false)
        }
      }
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutSideNumberItem);
        return () => document.removeEventListener('mousedown', handleClickOutSideNumberItem);
      })

    return (
        <div ref={numberRef} className="select-number-container">
            <div onClick={handleIsOpen} className="select-field">
                <div className="number-item">
                    {selectedItem}
                </div>
                <div className="select-number-arrow">
                    <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}></i>
                </div>
            </div>
            <div style={{ display: `${isOpen ? "block" : "none"}`, borderRadius: 16 }} className="select-number-popup">
                {
                    items && items.map((el) => {
                        return <div key={el.id} onClick={() => onClickItem(el.token)}>{el.token}</div>
                    })
                }
            </div>
        </div>
    )
}

export default SelectNumber
