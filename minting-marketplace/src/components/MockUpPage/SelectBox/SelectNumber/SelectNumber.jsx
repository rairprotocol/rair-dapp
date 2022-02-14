import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CurrentTokens } from "./CurrentTokens/CurrentTokens";
import { ListOfTokens } from "./ListOfTokens/ListOfTokens";
import "./SelectNumber.css";

const SelectNumber = ({
  blockchain,
  items,
  handleClickToken,
  selectedToken,
  totalCount,
  product,
  contract,
  setSelectedToken,
}) => {
  // console.log(items);
  
  const { primaryColor } = useSelector((store) => store.colorStore);

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

  const RenderOption = () => {
    if (totalCount < 100) {
      return (
        <CurrentTokens
          primaryColor={primaryColor}
          items={items}
          isOpen={isOpen}
          selectedToken={selectedToken}
          selectedItem={selectedItem}
          setIsOpen={setIsOpen}
          numberRef={numberRef}
          handleIsOpen={handleIsOpen}
          onClickItem={onClickItem}
        />
      );
    }
    return (
      <ListOfTokens
        blockchain={blockchain}
        contract={contract}
        isOpen={isOpen}
        handleIsOpen={handleIsOpen}
        numberRef={numberRef}
        onClickItem={onClickItem}
        product={product}
        primaryColor={primaryColor}
        setSelectedToken={setSelectedToken}
        selectedToken={selectedToken}
        selectedItem={selectedItem}
        setIsOpen={setIsOpen}
        totalCount={totalCount}
      />
    );
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSideNumberItem);
    return () =>
      document.removeEventListener("mousedown", handleClickOutSideNumberItem);
  });

  return RenderOption();
};

export default SelectNumber;
