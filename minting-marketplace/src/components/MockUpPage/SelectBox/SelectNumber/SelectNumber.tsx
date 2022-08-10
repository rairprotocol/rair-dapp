import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { ISelectNumber } from '../selectBox.types';
import { CurrentTokens } from './CurrentTokens/CurrentTokens';
import { ListOfTokens } from './ListOfTokens/ListOfTokens';
import './SelectNumber.css';

const SelectNumber: React.FC<ISelectNumber> = ({
  blockchain,
  items,
  handleClickToken,
  selectedToken,
  totalCount,
  product,
  contract,
  setSelectedToken
}) => {
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const [selectedItem, setSelectedItem] = useState<string>(selectedToken);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const numberRef = useRef<HTMLDivElement>(null);

  const handleClickOutSideNumberItem = useCallback(
    (e: MouseEvent) => {
      if (!numberRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    },
    [numberRef, setIsOpen]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSideNumberItem);
    return () =>
      document.removeEventListener('mousedown', handleClickOutSideNumberItem);
  }, [handleClickOutSideNumberItem]);

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const onClickItem = (el: string) => {
    setSelectedItem(el);
    handleClickToken(el);
    handleIsOpen();
  };

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
