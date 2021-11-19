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

    const blockMoreThousand = () => {
        if (items && items.length > 100) {
            return
        }
    }

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
            <div onClick={handleIsOpen} className="select-field" style={{ background: `${primaryColor === "rhyno" ? "var(--rhyno)" : "#383637"}` }}>
                <div className="number-item">
                    {selectedToken}
                </div>
                <div className="select-number-arrow">
                    <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}></i>
                </div>
            </div>
            <div
                style={{
                    display: `${isOpen ? "grid" : "none"}`,
                    background: `${primaryColor === "rhyno" ? "var(--rhyno)" : "#383637"}`,
                    border: `${primaryColor === "rhyno" ? "1px solid #D37AD6" : "none"}`,
                    //  overflowY: 'auto',
                }}
                className="select-number-popup"
            >
                <div className="select-number-title">
                    Serial number
                </div>
                {items &&
                    items.map((el, index) => {
                        return (
                            <div className={`select-number-box ${selectedItem === el.token ? "selected-box" : ''}`} style={{
                                background: `${primaryColor === "rhyno" ? "#A7A6A6" : "grey"}`,
                                color: `${primaryColor === "rhyno" ? "#fff" : "A7A6A6"}`,
                            }} key={el.id} onClick={() => onClickItem(el.token)}>
                                {el.token}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default SelectNumber;
