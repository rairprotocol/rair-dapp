import { IArrowUp } from '../filteringBlock.types';

export const ArrowUp: React.FC<IArrowUp> = ({ className }) => (
  <svg
    className={`${className || ''}`}
    width="11"
    height="14"
    viewBox="0 0 11 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.5 13V1"
      stroke="#A7A6A6"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 7L5.5 1L1.5 7"
      stroke="#A7A6A6"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowDown: React.FC<IArrowUp> = ({ className }) => (
  <svg
    className={`${className || ''}`}
    width="11"
    height="14"
    viewBox="0 0 11 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.5 1V13"
      stroke="#A7A6A6"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 7L5.5 13L1.5 7"
      stroke="#A7A6A6"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SimpleFilterArrow: React.FC<IArrowUp> = ({
  className /*rotate*/
}) => (
  <svg
    className={`${className || ''}`}
    width="11"
    height="6"
    viewBox="0 0 11 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.5 1L5.5 5L9.5 1"
      stroke="#E882D5"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FilterIconNew: React.FC<IArrowUp> = ({ className }) => (
  <svg
    className={`${className || ''}`}
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.999946 4L7.22217 4"
      stroke="#E882D5"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.7778 4L17 4"
      stroke="#E882D5"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 12L9 12"
      stroke="#E882D5"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5556 12L17 12"
      stroke="#E882D5"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.22217 1L7.22217 7"
      stroke="#E882D5"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5557 9L12.5557 15"
      stroke="#E882D5"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
