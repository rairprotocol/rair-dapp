import React, { useCallback, useEffect, useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rFetch } from '../../../../../utils/rFetch';
import {
  IModalCategories,
  TModalCategoriesItem,
  TOnClickCategories
} from '../../filteringBlock.types';
import Modal from '../../modal';

const categories: TModalCategoriesItem[] = [
  {
    name: 'Music',
    clicked: false
  },
  {
    name: 'Art',
    clicked: false
  },
  {
    name: 'Conference',
    clicked: false
  },
  {
    name: 'Science',
    clicked: false
  }
];

const ModalCategories: React.FC<IModalCategories> = ({
  setFilterCategoriesText,
  setIsOpenCategories,
  isOpenCategories,
  setCategory,
  setClick,
  setIsShowCategories,
  click
}) => {
  const [arrCategories, setArrCategories] =
    useState<TModalCategoriesItem[]>(categories);
  const [, /*clearAll*/ setClearAll] = useState<boolean>(false);

  const onChangeClicked = (name: TOnClickCategories) => {
    setClick?.(name);
    setClearAll(false);
    setIsShowCategories?.(true);
    setFilterCategoriesText?.(name);
  };

  const clearAllFilters = () => {
    setCategory?.(null);
    setClearAll(true);
    setIsShowCategories?.(false);
    setClick?.(null);
  };

  const onCloseModal = () => {
    setIsOpenCategories(false);
    // clearAllFilters()
    setClearAll(true);
  };

  const onClickButton = (data: TModalCategoriesItem) => {
    onChangeClicked(data.name);
    setCategory?.(data.name);
  };

  const onClickApply = () => {
    onCloseModal();
  };

  const getCategories = useCallback(async () => {
    const data = await rFetch('/api/categories');
    if (data.success) {
      setArrCategories(
        data.result.map((item) => {
          return { name: item.name, clicked: false };
        })
      );
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <Modal onClose={onCloseModal} open={isOpenCategories}>
      <div className="modal-content-metadata">
        <div className="block-close">
          <button className="modal-content-close" onClick={onCloseModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-filtering">
          <div className="categories-wraper">
            <div className="modal-filtering-title">
              <h4>Categories</h4>
            </div>
            <div className="filtering-categories">
              {arrCategories.map((c) => {
                return (
                  <button
                    className={`${
                      click === c.name ? 'categories-clicked' : ''

                      // c.clicked ? "categories-clicked" : ""
                    }`}
                    key={c.name}
                    // onClick={() => onChangeClicked(c.name)}
                    onClick={() => onClickButton(c)}>
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="price-wrapper">
            {/* unused-snippet */}
            {/* <div className="modal-filtering-price-title">
              <h4>Price</h4>
            </div> */}
            {/* <div className="filtering-price">
              <select className="select-price">
                <option value="0">Select</option>
                <option value="1">Ethereum(ETH)</option>
                <option value="2">Bitcoin(BTC)</option> */}
            {/* <span className="price-arrow"><FontAwesomeIcon icon={faChevronDown} /></span> */}
            {/* </select>
              <BlockMinMax clearAll={clearAll} />
            </div> */}
          </div>
        </div>
        <hr />
        <div className="modal-filtering-btn">
          <button
            className="modal-filtering-clear-btn"
            onClick={() => {
              clearAllFilters();
            }}>
            Clear
          </button>
          <button
            className="modal-filtering-apply-btn"
            onClick={() => {
              onClickApply();
            }}>
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCategories;

//unused-snippet 1
// const updatedCategory = arrCategories.map((cat, index) => {
//     if (name === cat.name) {
//         return {
//             ...cat,
//             clicked: !cat.clicked
//         }
//     }
//     else {
//         return {
//             ...cat
//         }
//     }
// })
// setClearAll(false)
// setArrCategories(updatedCategory);

//unused-snippet 2
// const clearArrCategories = arrCategories.map((cat) => {
//     return {
//         ...cat,
//         clicked: false
//     }
// })
// setArrCategories(clearArrCategories);
// setClearAll(true);
