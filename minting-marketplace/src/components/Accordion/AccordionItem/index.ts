import React from 'react';
export type TAccordionItemProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  itemImg?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: any;
  itemBtn: React.ReactNode;
  isStayExpand?: boolean;
  isMobileDesign?: boolean;
};
