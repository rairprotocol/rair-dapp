import React from 'react';
import { Provider, useStore } from 'react-redux';

import { TalkSalesButton } from './TalkSalesButton';

import { useAppSelector } from '../../../../hooks/useReduxHooks';
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
  const { primaryColor } = useAppSelector((store) => store.colors);

  const { adminRights } = useAppSelector((store) => store.user);

  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const reactSwal = useSwal();

  const store = useStore();

  const openInquiriesPage = () => {
    reactSwal.fire({
      title: <h2>{currentUserAddress ? 'Contact Us' : 'Support'}</h2>,
      html: (
        <Provider store={store}>
          <InquiriesPage />
        </Provider>
      ),
      showConfirmButton: false,
      width: '85vw'
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
