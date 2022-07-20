//@ts-nocheck
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CurrentTokens } from './CurrentTokens/CurrentTokens';
import { ListOfTokens } from './ListOfTokens/ListOfTokens';
import './SelectNumber.css';

const SelectNumber = ({
  blockchain,
  items,
  handleClickToken,
  selectedToken,
  totalCount,
  product,
  contract,
  setSelectedToken
}) => {
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

  // const handleClickOutSideNumberItem = useCallback(
  //   (e) => {
  //     if (!numberRef.current.contains(e.target)) {
  //       setIsOpen(false);
  //     }
  //   },
  //   [numberRef, setIsOpen]
  // );

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutSideNumberItem);
  //   return () =>
  //     document.removeEventListener("mousedown", handleClickOutSideNumberItem);
  // }, [handleClickOutSideNumberItem]);

  return totalCount < 100 ? (
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
  ) : (
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

export default SelectNumber;
