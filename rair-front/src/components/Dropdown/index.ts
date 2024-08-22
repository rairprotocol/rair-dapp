export type TOption = {
  name?: string;
  chainId?: string;
  clicked?: boolean;
  dropDownImg?: boolean;
  optionId?: number;
  display?: boolean;
  categoryId?: string;
};
export type TDropdownProps = {
  options: Array<TOption>;
  onDropdownChange: (ev: React.SyntheticEvent<HTMLInputElement>) => void;
  dropdownIMG?: React.ReactNode;
  selectedOptions: Array<TOption | undefined>;
  isMobileDesign?: boolean;
};
