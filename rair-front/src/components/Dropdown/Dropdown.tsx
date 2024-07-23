import chainData from '../../utils/blockchainData';

import { TDropdownProps } from '.';

import './styles.css';
const Dropdown = ({
  options,
  onDropdownChange,
  dropdownIMG,
  selectedOptions,
  isMobileDesign
}: TDropdownProps) => {
  return (
    <div className="dropdown-wrapper">
      <ul className="dropdown-options">
        {options?.map((option, idx) => {
          // logic for multiple select
          const isChecked = !!selectedOptions?.find(
            (selectedOption) => selectedOption?.optionId === option.optionId
          );
          if(option?.display !== false) {
            return (
              <li
                key={idx + Math.random() * 1_000_000}
                className={`dropdown-option`}>
                {option?.dropDownImg && (
                  <div
                    key={idx + Math.random() * 1_000_000}
                    className={`dropdownn-chain-icons ${
                      isMobileDesign ? 'mobile-chain-icons' : ''
                    }`}>
                    <img
                      className={`dropdownn-chain-icons ${
                        isMobileDesign ? 'mobile-chain-icons' : ''
                      }`}
                      src={`${
                        option?.chainId && chainData[option?.chainId]?.image
                      }`}
                      alt="blockchain-img"
                      key={idx + Math.random() * 1_000_000}
                    />
                  </div>
                )}
                {dropdownIMG}
                <div
                  className="dropdown-option-wrapper"
                  key={idx + Math.random() * 1_000_000}>
                  <span
                    key={idx + Math.random() * 1_000_000}
                    className="dropdown-option-text">
                    {option.name}
                  </span>
                  <input
                    className={`dropdown-option-checkbox ${
                      isMobileDesign ? 'mobile-checkbox' : ''
                    }`}
                    data-title={`${option?.chainId ? 'blockchain' : 'category'}`}
                    type="checkbox"
                    value={option.optionId}
                    onChange={onDropdownChange}
                    checked={isChecked}
                  />
                </div>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};
export default Dropdown;
