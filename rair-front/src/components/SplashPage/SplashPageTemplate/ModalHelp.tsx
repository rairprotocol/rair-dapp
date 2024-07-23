import React from 'react';
import { useSelector } from 'react-redux';
import {
  faChevronDown,
  faChevronUp,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from '../../../ducks';
import { IModalHelp } from '../splashPage.types';

const ModalHelp: React.FC<IModalHelp> = ({
  openCheckList,
  purchaseList,
  togglePurchaseList,
  toggleCheckList,
  backgroundColor,
  templateOverride
}) => {
  const primaryColor = useSelector<RootState, string>(
    (store) => store.colorStore.primaryColor
  );

  const dappUrl = window.location.host;
  const metamaskAppDeepLink = 'https://metamask.app.link/dapp/' + dappUrl;

  return (
    <div
      style={{
        display: `${openCheckList ? 'block' : 'none'}`,
        color: 'white',
        background: `${
          primaryColor === 'charcoal'
            ? backgroundColor?.darkTheme
            : backgroundColor?.lightTheme
        }`
      }}
      className="tutorial-checklist">
      <h5>{!templateOverride && 'UkraineGlitch'} purchase checklist</h5>
      <div className="tutorial-show-list" onClick={() => togglePurchaseList()}>
        <FontAwesomeIcon icon={purchaseList ? faChevronDown : faChevronUp} />
      </div>
      <div className="tutorial-close" onClick={toggleCheckList}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
      <ul style={{ display: `${purchaseList ? 'block' : 'none'}` }}>
        <li>
          1. Make sure you have the
          <a href={metamaskAppDeepLink} target="_blank" rel="noreferrer">
            {' '}
            metamask extension{' '}
          </a>
          installed
        </li>
        <li>
          2. Click connect wallet in top right corner. You must be fully logged
          into metamask with your password first
        </li>
        <li>3. Sign the request to complete login.</li>
        <li>
          4. Make sure you are switched to the {templateOverride && 'correct'}{' '}
          {!templateOverride && 'Ethereum'} network and have{' '}
          {templateOverride && 'sufficient funds'}{' '}
          {!templateOverride && 'at least .21 ETH'} to cover price + gas fees
        </li>
      </ul>
    </div>
  );
};

export default ModalHelp;
