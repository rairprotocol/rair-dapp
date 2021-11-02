import React, { useRef, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import "./SelectNumber.css";

const SelectNumber = ({ items, handleClickToken, selectedToken }) => {
    const { primaryColor } = useSelector(store => store.colorStore);

    const [selectedItem, setSelectedItem] = useState(selectedToken);
    const [isOpen, setIsOpen] = useState(false);

    const numberRef = useRef();

    const handleIsOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const onClickItem = (el) => {
        setSelectedItem(el);
        handleClickToken(el);
        handleIsOpen();
    };

    const handleClickOutSideNumberItem = (e) => {
        if (!numberRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutSideNumberItem);
        return () =>
            document.removeEventListener("mousedown", handleClickOutSideNumberItem);
    });

    return (
        <div ref={numberRef} className="select-number-container">
            <div onClick={handleIsOpen} className="select-field" style={{background: `${primaryColor === "rhyno" ? "var(--rhyno)" : "#383637"}` }}>
                <div className="number-item">
                    {selectedItem ? selectedItem : selectedToken}
                </div>
                <div className="select-number-arrow">
                    <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}></i>
                </div>
            </div>
            <div
                style={{ 
                    display: `${isOpen ? "block" : "none"}`,
                     borderRadius: 16,
                     background: `${primaryColor === "rhyno" ? "var(--rhyno)" : "#383637"}`,
                     border: `${primaryColor === "rhyno" ? "1px solid #D37AD6" : "none"}`
                    }}
                className="select-number-popup"
            >
                {items &&
                    items.map((el) => {
                        return (
                            <div key={el.id} onClick={() => onClickItem(el.token)}>
                                {el.token}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default SelectNumber;
