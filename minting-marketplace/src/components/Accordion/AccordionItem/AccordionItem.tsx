import { TAccordionItemProps } from '.';

import '../styles.css';
const AccordionItem = ({
  title,
  children,
  isOpen,
  setIsOpen,
  itemImg,
  itemBtn,
  isStayExpand
}: TAccordionItemProps) => {
  return (
    <div className="home-filter-modal-item">
      <div className="accordion-item-heading">
        {itemImg && <div className="accordion-img">{itemImg}</div>}
        <div>{title}</div>
        <div onClick={setIsOpen} className="home-filter-modal-button">
          {itemBtn}
        </div>
      </div>
      {isStayExpand && <div className="Accordion-item-content">{children}</div>}
    </div>
  );
};
export default AccordionItem;
