//@ts-nocheck
//unused-component
import React, { useEffect, useRef, useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ItemRankContainer, SelectBoxItemRank } from './ItemRankItems';

import './styles.css';

const ItemRank = ({
  items,
  primaryColor,
  selectedToken
  // getAllProduct,
  // offerDataInfo,
  // setSelectedToken,
  // handleClickToken
}) => {
  const [itemsToken, setItemsToken] = useState([]);
  const [showItems, setShowItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const rankRef = useRef();

  // const sortedClick = () => {
  //   switch (offerDataInfo) {
  //     case "Ultra Rair":
  //       const firstTokenFromUltra = offerDataInfo.filter((e) => e.offerIndex === 0);
  //       setTokenDataFiltered(firstTokenFromUltra);
  //       navigate(
  //         `/collection/${params.blockchain}/${params.contract}/${params.product}/${params.tokenId}`
  //       );
  //       break;
  //     case "Rair":
  //       const secondTokenFromUltra = offerDataInfo.filter((e) => e.offerIndex === 1);
  //       setTokenDataFiltered(secondTokenFromUltra);
  //       navigate(
  //         `/collection/${params.blockchain}/${params.contract}/${params.product}/${params.tokenId}`
  //       );
  //       break;
  //     default:
  //       const thirdTokenFromUltra = offerDataInfo.filter((e) => e.offerIndex === 2);
  //       setTokenDataFiltered(thirdTokenFromUltra);
  //       navigate(
  //         `/collection/${params.blockchain}/${params.contract}/${params.product}/${params.tokenId}`
  //       );
  //   }
  // };

  useEffect(() => {
    if (itemsToken.length === 0 && typeof items === 'object') {
      setItemsToken([...items]);
      setSelectedItem(items[0]);
    }
  }, [items, itemsToken]);

  const dropDown = () => {
    setShowItems(!showItems);
  };
  //TODO:will be used in a future
  // const onSelectItem = (item) => {
  //   setSelectedItem(item);
  //   setShowItems(false);
  //   getAllProduct(item.range[0], item.range[1]);
  // };

  const handleClickOutSideItemRank = (e) => {
    if (!rankRef.current.contains(e.target)) {
      setShowItems(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSideItemRank);
    return () =>
      document.removeEventListener('mousedown', handleClickOutSideItemRank);
  });

  return (
    <div ref={rankRef} className="item-rant--box">
      <ItemRankContainer
        primaryColor={primaryColor}
        className="item-rank--container">
        <div className="select-box--selected-item" onClick={dropDown}>
          <span className="select-box-item-box">{selectedItem?.pkey}</span>
          {itemsToken !== null ? (
            selectedToken ? (
              itemsToken.map((i) => {
                if (i.token === selectedToken) {
                  return (
                    <span key={i.id}>
                      {i.value}
                      {/* {i.token} */}
                    </span>
                  );
                }
                return null;
              })
            ) : (
              <span>{selectedItem.value}</span>
            )
          ) : (
            'Need to select'
          )}
        </div>
        <div className="select-box--arrow">
          <FontAwesomeIcon icon={showItems ? faChevronUp : faChevronDown} />
        </div>
        <SelectBoxItemRank
          className={'select-box--items items-rank'}
          showItems={showItems}
          primaryColor={primaryColor}>
          {itemsToken !== null &&
            itemsToken.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  //TODO: just now need to off
                  // onSelectItem(item);
                  // props.handleClickToken(item.token)
                }}
                className={`item-rank-wrapper ${
                  selectedItem === item ? 'selected' : ''
                }`}>
                <span className="selected-item-popup-key">{item.pkey}</span>
                <span>{item.value}</span>{' '}
                <p>
                  {item.soldCopies}/{item.copies}
                </p>
              </div>
            ))}
        </SelectBoxItemRank>
      </ItemRankContainer>
    </div>
  );
};

export default ItemRank;
