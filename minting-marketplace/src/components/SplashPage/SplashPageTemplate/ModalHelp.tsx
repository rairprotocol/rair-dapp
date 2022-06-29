//@ts-nocheck
import React from 'react';
import { useSelector } from 'react-redux';

const ModalHelp = ({
  openCheckList,
  purchaseList,
  togglePurchaseList,
  toggleCheckList,
  backgroundColor
}) => {
  const { primaryColor } = useSelector((store) => store.colorStore);

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
      <h5>UkraineGlitch purchase checklist</h5>
      <div className="tutorial-show-list" onClick={() => togglePurchaseList()}>
        <i className={`fas fa-chevron-${purchaseList ? 'down' : 'up'}`}></i>
      </div>
      <div className="tutorial-close" onClick={() => toggleCheckList()}>
        <i className="fas fa-times"></i>
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
          4. Make sure you are switched to the Ethereum network and have at
          least .21 ETH to cover price + gas fees
        </li>
      </ul>
    </div>
  );
};

export default ModalHelp;
