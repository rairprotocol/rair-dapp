import React from 'react';
import { Provider, useSelector, useStore } from 'react-redux';

import { TalkSalesButton } from './TalkSalesButton';

import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import { TUsersInitialState } from '../../../../ducks/users/users.types';
import useSwal from '../../../../hooks/useSwal';
import InquiriesPage from '../../../InquiriesPage/InquiriesPage';

interface ITalkSalesComponent {
  classes?: string;
  text: string;
  isAboutPage?: boolean;
}

const TalkSalesComponent: React.FC<ITalkSalesComponent> = ({
  classes,
  text,
  isAboutPage
}) => {
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const { adminRights } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const reactSwal = useSwal();

  const store = useStore();

  const openInquiriesPage = () => {
    reactSwal.fire({
      title: (
        <h2 style={{ color: 'var(--bubblegum)' }}>
          {currentUserAddress ? 'Contact Us' : 'Support'}
        </h2>
      ),
      html: (
        <Provider store={store}>
          <InquiriesPage />
        </Provider>
      ),
      showConfirmButton: false,
      width: '85vw',
      customClass: {
        popup: `bg-${
          primaryColor === '#dedede' ? 'rhyno' : 'charcoal'
        } rounded-rair`
      }
    });
  };

  return (
    <TalkSalesButton
      isAboutPage={isAboutPage}
      adminPanel={adminRights}
      primaryColor={primaryColor}
      className={classes ? classes : ''}
      currentUserAddress={currentUserAddress}
      onClick={openInquiriesPage}>
      {text}
    </TalkSalesButton>
  );
};

export default TalkSalesComponent;
