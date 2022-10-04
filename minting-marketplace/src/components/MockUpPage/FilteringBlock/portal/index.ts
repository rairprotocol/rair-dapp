import React from 'react';
import ReactDOM from 'react-dom';

import { IPortal } from '../filteringBlock.types';

/* Portal for filtering Modal*/
const Portal: React.FC<IPortal> = ({ children, parent, className }) => {
  const el = React.useMemo(() => document.createElement('div'), []);
  React.useEffect(() => {
    const target = parent /*&& parent.appendChild*/ ? parent : document.body;
    const classList = ['portal-container'];
    if (className) className.split(' ').forEach((item) => classList.push(item));
    classList.forEach((item) => el.classList.add(item));
    target.appendChild(el);
    return () => {
      target.removeChild(el);
    };
  }, [el, parent, className]);
  return ReactDOM.createPortal(children, el);
};

export default Portal;
