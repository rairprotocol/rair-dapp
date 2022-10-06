import React from 'react';
import { Provider, useSelector, useStore } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { TalkSalesButton } from './TalkSalesButton';

import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import InquiriesPage from '../../../InquiriesPage/InquiriesPage';

interface ITalkSalesComponent {
  classes?: string;
  text: string;
}

const reactSwal = withReactContent(Swal);

const TalkSalesComponent: React.FC<ITalkSalesComponent> = ({
  classes,
  text
}) => {
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const store = useStore();

  const openInquiriesPage = () => {
    reactSwal.fire({
      title: <h1 style={{ color: 'var(--bubblegum)' }}>Inquiries</h1>,
      html: (
        <Provider store={store}>
          <InquiriesPage />
        </Provider>
      ),
      showConfirmButton: false,
      width: '85vw',
      customClass: {
        popup: `bg-${primaryColor} rounded-rair`
      }
    });
  };

  return (
    <TalkSalesButton
      primaryColor={primaryColor}
      className={classes ? classes : ''}
      currentUserAddress={currentUserAddress}
      onClick={openInquiriesPage}>
      {text}
    </TalkSalesButton>
  );
};

export default TalkSalesComponent;
