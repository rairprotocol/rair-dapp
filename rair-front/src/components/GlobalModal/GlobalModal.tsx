import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  GlobalModalContext,
  TGlobalModalContext
} from '../../providers/ModalProvider';

import { IGlobalModal } from '.';
const GlobalModal = ({
  parentContainerId,
  renderModalContent
}: IGlobalModal) => {
  const [parentElement, setParenElement] = useState<HTMLElement | null>(null);
  const { globalModalState: GlobalModalState } =
    useContext<TGlobalModalContext>(GlobalModalContext);
  useEffect(() => {
    const parentElement = document.getElementById(parentContainerId);
    setParenElement(parentElement);
  }, [parentContainerId]);
  const globalModalContent = GlobalModalState?.isOpen ? (
    <>{renderModalContent ? renderModalContent(GlobalModalState) : null}</>
  ) : null;
  return parentElement ? createPortal(globalModalContent, parentElement) : null;
};
export default GlobalModal;
