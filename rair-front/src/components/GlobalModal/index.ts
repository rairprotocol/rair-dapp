import { TGlobalModalState } from '../../providers/ModalProvider';
export interface IGlobalModal {
  renderModalContent: (modalState: TGlobalModalState) => JSX.Element | null;
  parentContainerId: string;
}
