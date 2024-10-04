import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { Hex } from 'viem';

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

import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useServerSettings from '../../../hooks/useServerSettings';
import {
  GlobalModalContext,
  TGlobalModalContext
} from '../../../providers/ModalProvider';
import { GLOBAL_MODAL_ACTIONS } from '../../../providers/ModalProvider/actions';
import { loadFrontPageCatalog } from '../../../redux/tokenSlice';
import { loadVideoList } from '../../../redux/videoSlice';
import CustomAccordion from '../../Accordion/Accordion';
import AccordionItem from '../../Accordion/AccordionItem/AccordionItem';
import { TOption } from '../../Dropdown';
import Dropdown from '../../Dropdown/Dropdown';
import { closeModal, openModal } from '../helpers/OnOpenModal';

import './styles.css';
export type THomePageFilterModalProps = {
  isMobileDesign?: boolean;
  className?: string;
};

const HomePageFilterModal: FC<THomePageFilterModalProps> = ({
  isMobileDesign,
  className
}) => {
  const { blockchainSettings, categories } = useAppSelector(
    (store) => store.settings
  );
  const { textColor, primaryButtonColor, isDarkMode, primaryColor } =
    useAppSelector((store) => store.colors);
  const { getBlockchainData } = useServerSettings();

  const [selectedBlockchains, setSelectedBlockchains] = useState<Array<Hex>>(
    []
  );
  const [blockchainOptions, setBlockchainOptions] = useState<Array<TOption>>(
    []
  );
  const [categoryOptions, setCategoryOptions] = useState<Array<TOption>>([]);
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    []
  );

  const dispatch = useAppDispatch();

  const { globalModalState, globalModaldispatch } =
    useContext<TGlobalModalContext>(GlobalModalContext);
  const [isBlockchainOpen, setIsBlockchainOpen] = useState<boolean>(false);
  const isBlockchainStayExpand = useRef<boolean>(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const isCategoryStayExpand = useRef<boolean>(false);

  const { isBlockchainExpand, isCategoryExpand, isOpen } = globalModalState;

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
    if (blockchainSettings) {
      const filteredblockchainSettings: Array<TOption> = blockchainSettings.map(
        (chain) => {
          const chainData = getBlockchainData(chain.hash);
          return {
            optionId: chain.hash,
            display: chain.display,
            dropDownImg: chainData?.image,
            name: chain.name
          };
        }
      );
      setBlockchainOptions(filteredblockchainSettings);
    }
  }, [blockchainSettings, getBlockchainData]);

  useEffect(() => {
    if (categories) {
      const options = categories.map((category) => {
        return {
          name: category.name,
          optionId: category._id!
        };
      });
      setCategoryOptions(options);
    }
  }, [categories]);

  const checkBlockchain = useCallback(
    (value: string) => {
      const aux = [...selectedBlockchains];
      const index = aux.findIndex((chain) => chain === value);
      if (index === -1) {
        aux.push(value as Hex);
      } else {
        aux.splice(index, 1);
      }
      setSelectedBlockchains(aux);
    },
    [selectedBlockchains]
  );

  const checkCategory = useCallback(
    (value: string) => {
      const aux = [...selectedCategories];
      const index = aux.findIndex((category) => category === value);
      if (index === -1) {
        aux.push(value as Hex);
      } else {
        aux.splice(index, 1);
      }
      setSelectedCategories(aux);
    },
    [selectedCategories]
  );

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

  const applyFilters = useCallback(
    (selectedBlockchains: Array<Hex>, selectedCategories: Array<string>) => {
      if (selectedBlockchains) {
        sessionStorage.setItem(
          'BlockchainItems',
          JSON.stringify(selectedBlockchains)
        );
      }
      if (selectedCategories) {
        sessionStorage.setItem(
          'CategoryItems',
          JSON.stringify(selectedCategories)
        );
      }
      dispatch(
        loadFrontPageCatalog({
          categories: selectedCategories,
          blockchains: selectedBlockchains
        })
      );
      dispatch(
        loadVideoList({
          blockchain: selectedBlockchains,
          category: selectedCategories
        })
      );
      onCloseBtn();
      closeModal();
    },
    [dispatch, onCloseBtn]
  );

  const loadStoredFilters = useCallback(() => {
    const storedCategories = sessionStorage.getItem('CategoryItems');
    const storedBlockchains = sessionStorage.getItem('BlockchainItems');
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      setSelectedCategories(parsedCategories);
    }
    if (storedBlockchains) {
      const parsedBlockchains = JSON.parse(storedBlockchains);
      setSelectedBlockchains(parsedBlockchains);
    }
  }, []);

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
      payload: { applyFilters }
    });
  }, [globalModaldispatch, applyFilters]);

  const AccordionItemBtn = (isItemOpen) =>
    isItemOpen ? (
      <StyledChevronUPIcon
        className={`shevron-icon ${isMobileDesign ? 'mobile-shevrone' : ''}`}
        primaryColor={primaryColor}
        isDarkMode={isDarkMode}
      />
    ) : (
      <StyledChevronDownIcon
        className={`shevron-icon ${isMobileDesign ? 'mobile-shevrone' : ''}`}
        primaryColor={primaryColor}
        isDarkMode={isDarkMode}
      />
    );

  const clearAllFilters = useCallback(() => {
    setSelectedBlockchains([]);
    setSelectedCategories([]);
    sessionStorage.removeItem('CategoryItems');
    sessionStorage.removeItem('BlockchainItems');
    dispatch(loadFrontPageCatalog({}));
    dispatch(loadVideoList({}));
  }, [dispatch]);

  useEffect(() => {
    loadStoredFilters();
  }, [loadStoredFilters]);

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
          id={'category'}
          title="Category"
          isOpen={isCategoryOpen}
          itemBtn={AccordionItemBtn(isCategoryOpen)}
          setIsOpen={setIsCatOpen}
          isStayExpand={isCategoryExpand}
          itemImg={
            <StyledCategoryIcon
              primaryColor={primaryColor}
              isDarkMode={isDarkMode}
              className={`${isMobileDesign ? 'accordion-icon' : ''}`}
            />
          }>
          {categories && (
            <Dropdown
              isMobileDesign={isMobileDesign && isMobileDesign}
              onDropdownChange={checkCategory}
              options={categoryOptions}
              selectedOptions={selectedCategories}
              dropdownIMG={
                <StyledCategoryItemIcon
                  isDarkMode={isDarkMode}
                  primaryColor={primaryColor}
                  className={`dropdownn-chain-icons ${
                    isMobileDesign ? 'mobile-cat-icon' : ''
                  }`}
                />
              }
            />
          )}
        </AccordionItem>
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
              isDarkMode={isDarkMode}
              className={`${isMobileDesign ? 'accordion-icon' : ''}`}
              primaryColor={primaryColor}
            />
          }>
          {blockchainOptions && (
            <Dropdown
              onDropdownChange={checkBlockchain}
              options={blockchainOptions}
              selectedOptions={selectedBlockchains}
              isMobileDesign={isMobileDesign}
            />
          )}
        </AccordionItem>
      </CustomAccordion>
      <div className="filter-modal-btn-container ">
        <StyledClearButton
          isDarkMode={isDarkMode}
          disabled={!selectedBlockchains.length && !selectedCategories.length}
          primaryColor={primaryColor}
          onClick={clearAllFilters}
          className={`modal-filtering-button clear-btn ${
            isMobileDesign ? 'mobile-filter-clear-btn' : ''
          }`}>
          Clear all
        </StyledClearButton>
        <button
          disabled={!selectedBlockchains.length && !selectedCategories.length}
          className={`modal-filtering-button apply-btn ${
            isMobileDesign ? 'mobile-filter-apply-btn' : ''
          }`}
          style={{
            color: textColor,
            background: `${
              !isDarkMode
                ? 'linear-gradient(to right, #e882d5, #725bdb)'
                : import.meta.env.VITE_TESTNET === 'true'
                  ? 'var(--hot-drops)'
                  : primaryButtonColor
            }`
          }}
          onClick={() => applyFilters(selectedBlockchains, selectedCategories)}>
          Apply
        </button>
      </div>
    </HomePageModalFilter>
  );
};
export default HomePageFilterModal;
