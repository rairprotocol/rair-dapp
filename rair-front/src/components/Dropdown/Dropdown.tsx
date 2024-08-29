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
        {options?.map((option, index) => {
          // logic for multiple select
          const isChecked = selectedOptions.includes(option.optionId);
          if (option?.display !== false) {
            return (
              <li key={index} className={`dropdown-option`}>
                {option?.dropDownImg && (
                  <div
                    className={`dropdownn-chain-icons ${
                      isMobileDesign ? 'mobile-chain-icons' : ''
                    }`}>
                    <img
                      className={`dropdownn-chain-icons ${
                        isMobileDesign ? 'mobile-chain-icons' : ''
                      }`}
                      src={option.dropDownImg}
                      alt="blockchain-img"
                    />
                  </div>
                )}
                {dropdownIMG}
                <div className="dropdown-option-wrapper">
                  <label
                    htmlFor={`${option.name}${option.optionId}`}
                    className="dropdown-option-text">
                    {option.name}
                  </label>
                  <input
                    id={`${option.name}${option.optionId}`}
                    className={`dropdown-option-checkbox ${
                      isMobileDesign ? 'mobile-checkbox' : ''
                    }`}
                    data-title={`${
                      option?.chainId ? 'blockchain' : 'category'
                    }`}
                    type="checkbox"
                    onChange={() => {
                      onDropdownChange(option.optionId);
                    }}
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
