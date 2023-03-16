import { TAccordionProps } from '.';

import './styles.css';
const CustomAccordion = ({ children }: TAccordionProps) => {
  return <div className="accordion-content-wrapper">{children}</div>;
};
export default CustomAccordion;
