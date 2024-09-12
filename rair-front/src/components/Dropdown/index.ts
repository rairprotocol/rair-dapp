export type TOption = {
  optionId: string;
  display?: boolean;
  dropDownImg?: string;
  name: string;

  chainId?: string;
  clicked?: boolean;
  categoryId?: string;
};

export type TDropdownProps = {
  options: Array<TOption>;
  onDropdownChange: (value: string) => void;
  dropdownIMG?: React.ReactNode;
  selectedOptions: Array<string>;
  isMobileDesign?: boolean;
};
