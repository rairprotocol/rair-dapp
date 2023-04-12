//@ts-nocheck
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import {
  MobileCloseBtn,
  StyledBlockchainIcon,
  StyledCategoryIcon,
  StyledCategoryItemIcon,
  StyledChevronDownIcon,
  StyledChevronUPIcon,
  StyledClearButton
} from './FilterModalIcons';
import { HomePageModalFilter } from './HomePAgeModal';
import { MobileHeaderBlock } from './MobileHeaderBlock';

// import { IFilterModal } from '.';
import {
  GlobalModalContext,
  TGlobalModalContext
} from '../../../providers/ModalProvider';
import { GLOBAL_MODAL_ACTIONS } from '../../../providers/ModalProvider/actions';
import { rFetch } from '../../../utils/rFetch';
import CustomAccordion from '../../Accordion/Accordion';
import AccordionItem from '../../Accordion/AccordionItem/AccordionItem';
import { TOption } from '../../Dropdown';
import Dropdown from '../../Dropdown/Dropdown';
import { closeModal, openModal } from '../helpers/OnOpenModal';

import './styles.css';
export type THomePageFilterModalProps = {
  isMobileDesign?: boolean;
  className?: stirng;
};
const HomePageFilterModal: FC<THomePageFilterModalProps> = ({
  isMobileDesign,
  className
}) => {
  const blockchains = [
    {
      name: 'Matic Mainnet',
      chainId: '0x89',
      clicked: false,
      dropDownImg: true,
      optionId: 1
    },
    {
      name: 'Matic Testnet',
      chainId: '0x13881',
      clicked: false,
      dropDownImg: true,
      optionId: 2
    },
    {
      name: 'Goerli Testnet',
      chainId: '0x5',
      clicked: false,
      dropDownImg: true,
      optionId: 3
    },
    {
      name: 'Binance Testnet',
      chainId: '0x61',
      clicked: false,
      dropDownImg: true,
      optionId: 4
    },
    {
      name: 'Binance Mainnet',
      chainId: '0x38',
      clicked: false,
      dropDownImg: true,
      optionId: 5
    },
    {
      name: 'Ethereum Mainnet',
      chainId: '0x1',
      clicked: false,
      dropDownImg: true,
      optionId: 6
    }
  ];
  // const categories = [
  //   {
  //     name: 'Music',
  //     clicked: false,
  //     optionId: 7,
  //     categoryId: '62b459f9a64260001c1e205e'
  //   },
  //   {
  //     name: 'Art',
  //     clicked: false,
  //     optionId: 8,
  //     categoryId: '62b459f9a64260001c1e205f'
  //   },
  //   {
  //     name: 'Conference',
  //     clicked: false,
  //     optionId: 9,
  //     categoryId: '62b459f9a64260001c1e2060'
  //   },
  //   {
  //     name: 'Science',
  //     clicked: false,
  //     optionId: 10,
  //     categoryId: '62b459f9a64260001c1e2061'
  //   }
  // ];

  const [categories, setCategories] = useState([]);
  const { globalModalState, globalModaldispatch } =
    useContext<TGlobalModalContext>(GlobalModalContext);
  const [isBlockchainOpen, setIsBlockchainOpen] = useState<boolean>(false);
  const isBlockchainStayExpand = useRef<boolean>(false);
  const [selectedBlockchainItems, setSelectedBlockchainItems] = useState<
    Array<TOption | undefined>
  >([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const isCategoryStayExpand = useRef<boolean>(false);
  const [selectedCategoriesItems, setSelectedCategories] = useState<
    Array<TOption | undefined>
  >([]);
  const {
    primaryColor,
    setBlockchain,
    setCategory,
    isBlockchainExpand,
    isCategoryExpand,
    selectedBchItems,
    selectedCatItems,
    isOpen,
    clearFilter,
    setFilterText,
    setIsShow
  } = globalModalState;
  const setIsBChOpen = () => {
    if (isBlockchainExpand) {
      setIsBlockchainOpen(!isBlockchainExpand);
      isBlockchainStayExpand.current = !isBlockchainExpand;
      globalModaldispatch({
        type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
        payload: { isBlockchainExpand: !isBlockchainExpand }
      });
      return;
    }
    setIsBlockchainOpen(!isBlockchainOpen);
    isBlockchainStayExpand.current = isBlockchainStayExpand.current
      ? false
      : true;
    globalModaldispatch({
      type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
      payload: { isBlockchainExpand: isBlockchainStayExpand.current }
    });
  };
  const setIsCatOpen = () => {
    if (isCategoryExpand) {
      setIsCategoryOpen(!isCategoryExpand);
      isCategoryStayExpand.current = !isCategoryExpand;
      globalModaldispatch({
        type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
        payload: { isCategoryExpand: !isCategoryExpand }
      });
      return;
    }
    setIsCategoryOpen(!isCategoryOpen);
    isCategoryStayExpand.current = isCategoryStayExpand.current ? false : true;
    globalModaldispatch({
      type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
      payload: { isCategoryExpand: isCategoryStayExpand.current }
    });
  };
  useEffect(() => {
    if (selectedBchItems) {
      setSelectedBlockchainItems(selectedBchItems);
      const selectedFiltersItemsText = selectedBchItems.map(
        (selectedBchItem) => selectedBchItem.name
      );
      setFilterText(selectedFiltersItemsText);
      setIsShow(true);
    }
  }, [selectedBchItems, setFilterText, setIsShow]);

  useEffect(() => {
    if (selectedCatItems) {
      setSelectedCategories(selectedCatItems);
      const selectedFiltersItemsText = selectedCatItems.map(
        (selectedCatItem) => selectedCatItem.name
      );
      // setFilterText(selectedFiltersItemsText);
      setIsShow(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCatItems]);

  const onOptionChange = (ev: React.SyntheticEvent<HTMLInputElement>) => {
    const target = ev.target as HTMLInputElement;
    const selectedItemDataTitle = target.getAttribute('data-title');
    const selectedOptionId = Number(target?.value);
    if (selectedItemDataTitle === 'blockchain') {
      const selectedOption = blockchains?.find(
        (option) => option?.optionId === selectedOptionId
      );
      if (
        selectedBchItems?.filter(
          (selectedBchItem) => selectedBchItem?.optionId === selectedOptionId
        ).length
      ) {
        const selectedBchItems = selectedBlockchainItems?.filter(
          (selectedItem) => selectedItem?.optionId !== selectedOptionId
        );
        globalModaldispatch({
          type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
          payload: { selectedBchItems }
        });
        return setSelectedBlockchainItems(selectedBchItems);
      } else {
        if (selectedBchItems) {
          setSelectedBlockchainItems([...selectedBchItems, selectedOption]);
          globalModaldispatch({
            type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
            payload: {
              selectedBchItems: [...selectedBchItems, selectedOption]
            }
          });
          return;
        }
        setSelectedBlockchainItems((prevBchArray) => {
          return [...prevBchArray, selectedOption];
        });
        globalModaldispatch({
          type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
          payload: {
            selectedBchItems: [...selectedBlockchainItems, selectedOption]
          }
        });
      }
    }
    if (selectedItemDataTitle === 'category') {
      const selectedOption = categories?.find(
        (option) => option?.optionId === selectedOptionId
      );
      if (
        selectedCatItems?.filter(
          (selectedCatItem) => selectedCatItem?.optionId === selectedOptionId
        ).length
      ) {
        const selectedCatItems = selectedCategoriesItems?.filter(
          (selectedItem) => selectedItem?.optionId !== selectedOptionId
        );
        globalModaldispatch({
          type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
          payload: { selectedCatItems }
        });
        return setSelectedCategories(selectedCatItems);
      } else {
        // let catArray;
        if (selectedCatItems) {
          setSelectedCategories([...selectedCatItems, selectedOption]);
          globalModaldispatch({
            type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
            payload: {
              selectedCatItems: [...selectedCatItems, selectedOption]
            }
          });
          return;
        }
        setSelectedCategories((prevArray) => {
          return [...prevArray, selectedOption];
        });
        globalModaldispatch({
          type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
          payload: {
            selectedCatItems: [...selectedCategoriesItems, selectedOption]
          }
        });
      }
    }
  };
  const onScrollChange = useCallback(() => {
    if (isMobileDesign && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileDesign, isOpen]);
  const onCloseBtn = useCallback(() => {
    if (isMobileDesign) {
      globalModaldispatch({
        type: GLOBAL_MODAL_ACTIONS.TOGLE_IS_MODAL_OPEN,
        payload: null
      });
      onScrollChange();
      document.body.style.overflow = 'unset';
    }
  }, [globalModaldispatch, onScrollChange, isMobileDesign]);
  const onFilterApply = useCallback(
    (
      selectedBch: [TOption | undefined],
      selectedCategories: [TOption | undefined] | undefined = undefined
    ) => {
      if (selectedBch) {
        let allSelectedChains = '';
        selectedBch.forEach((selectedBchItem, idx) => {
          if (selectedBch.length > 1 && selectedBchItem?.chainId) {
            if (selectedBch.length - 1 === idx) {
              allSelectedChains = allSelectedChains.concat(
                selectedBchItem?.chainId
              );
              return;
            }
            allSelectedChains = allSelectedChains.concat(
              selectedBchItem?.chainId,
              ','
            );
            return;
          }
          if (selectedBchItem?.chainId) {
            allSelectedChains = allSelectedChains.concat(
              selectedBchItem?.chainId
            );
            return;
          }
        });
        setBlockchain(allSelectedChains);
      }
      if (selectedCategories) {
        let allSelectedCategories = '';
        selectedCategories.forEach((selectedCategItem, idx) => {
          if (selectedCategories.length > 1 && selectedCategItem?.categoryId) {
            if (selectedCategories.length - 1 === idx) {
              allSelectedCategories = allSelectedCategories.concat(
                selectedCategItem?.categoryId
              );
              return;
            }
            allSelectedCategories = allSelectedCategories.concat(
              selectedCategItem?.categoryId,
              ','
            );
            return;
          }
          if (selectedCategItem?.categoryId) {
            allSelectedCategories = allSelectedCategories.concat(
              selectedCategItem?.categoryId
            );
            return;
          }
        });
        const catArray = allSelectedCategories
          .split(',')
          .map((el) => {
            return `&category[]=${el}`;
          })
          .join('');
        if (catArray === '&category[]=') {
          setCategory(undefined);
        } else {
          setCategory(catArray);
        }
      }
      onCloseBtn();
      closeModal();
      // setCategories(selectedCategories[0]);
    },
    [onCloseBtn, setBlockchain, setCategory]
  );
  useEffect(() => {
    if (isOpen && isMobileDesign) {
      openModal();
      onScrollChange();
    } else {
      closeModal();
      onScrollChange();
    }
  }, [isOpen, isMobileDesign, onScrollChange]);
  useEffect(() => {
    globalModaldispatch({
      type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
      payload: { onFilterApply }
    });
  }, [globalModaldispatch, onFilterApply]);
  const AccordionItemBtn = (isItemOpen) =>
    isItemOpen ? (
      <StyledChevronUPIcon
        className={`shevron-icon ${isMobileDesign ? 'mobile-shevrone' : ''}`}
        primaryColor={primaryColor}
      />
    ) : (
      <StyledChevronDownIcon
        className={`shevron-icon ${isMobileDesign ? 'mobile-shevrone' : ''}`}
        primaryColor={primaryColor}
      />
    );
  const handleCleanFilter = () => {
    clearFilter();
    setSelectedCategories([]);
    globalModaldispatch({
      type: GLOBAL_MODAL_ACTIONS.UPDATE_MODAL,
      payload: {
        selectedBchItems: [],
        selectedCatItems: []
      }
    });
  };

  const getCategories = useCallback(async () => {
    const res = await rFetch(`/api/categories`);

    if (res.success) {
      const categ = res.categories.map((el, index) => {
        return {
          name: el.name,
          clicked: false,
          optionId: index + 7,
          categoryId: el._id
        };
      });
      setCategories(categ);
    }
  }, [setCategories]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);
  return (
    <HomePageModalFilter
      id="home-page-modal-filter"
      className={`filter-modal-wrapper ${className ? className : ''}`}
      isMobileDesign={isMobileDesign}
      primaryColor={primaryColor}>
      {isMobileDesign && (
        <MobileHeaderBlock className="mobile-close-btn-container">
          <span className="filter-header">Filters</span>
          <button className="mobile-close-btn" onClick={onCloseBtn}>
            <MobileCloseBtn className="" />
          </button>
        </MobileHeaderBlock>
      )}
      <CustomAccordion>
        <AccordionItem
          isMobileDesign={isMobileDesign}
          id={'blockchain'}
          title="Blockchain"
          isOpen={isBlockchainOpen}
          itemBtn={AccordionItemBtn(isBlockchainOpen)}
          setIsOpen={setIsBChOpen}
          isStayExpand={isBlockchainExpand}
          itemImg={
            <StyledBlockchainIcon
              className={`${isMobileDesign ? 'accordion-icon' : ''}`}
              primaryColor={primaryColor}
            />
          }>
          <Dropdown
            onDropdownChange={onOptionChange}
            options={blockchains}
            selectedOptions={selectedBchItems && selectedBchItems}
            key={Math.random() * 1_000_000}
            isMobileDesign={isMobileDesign && isMobileDesign}
          />
        </AccordionItem>
        <AccordionItem
          id={'category'}
          title="Category"
          isOpen={isCategoryOpen}
          itemBtn={AccordionItemBtn(isCategoryOpen)}
          setIsOpen={setIsCatOpen}
          isStayExpand={isCategoryExpand}
          itemImg={
            <StyledCategoryIcon
              primaryColor={primaryColor}
              className={`${isMobileDesign ? 'accordion-icon' : ''}`}
            />
          }>
          {categories && (
            <Dropdown
              isMobileDesign={isMobileDesign && isMobileDesign}
              onDropdownChange={onOptionChange}
              options={categories}
              key={Math.random() * 1_000_000}
              selectedOptions={selectedCatItems && selectedCatItems}
              dropdownIMG={
                <StyledCategoryItemIcon
                  primaryColor={primaryColor}
                  className={`dropdownn-chain-icons ${
                    isMobileDesign ? 'mobile-cat-icon' : ''
                  }`}
                />
              }
            />
          )}
        </AccordionItem>
      </CustomAccordion>
      <div className="filter-modal-btn-container ">
        <StyledClearButton
          disabled={!selectedBchItems && !selectedCatItems}
          primaryColor={primaryColor}
          onClick={handleCleanFilter}
          className={`modal-filtering-button clear-btn ${
            isMobileDesign ? 'mobile-filter-clear-btn' : ''
          }`}>
          Clear all
        </StyledClearButton>
        <button
          disabled={!selectedBchItems && !selectedCatItems}
          className={`modal-filtering-button apply-btn ${
            isMobileDesign ? 'mobile-filter-apply-btn' : ''
          }`}
          onClick={() => onFilterApply(selectedBchItems, selectedCatItems)}>
          Apply
        </button>
      </div>
    </HomePageModalFilter>
  );
};
export default HomePageFilterModal;
