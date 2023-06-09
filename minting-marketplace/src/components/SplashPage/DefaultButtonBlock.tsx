import React from 'react';

import { IDefaultButtonBlock } from './splashPage.types';

import useConnectUser from '../../hooks/useConnectUser';

import AuthorCardButton from './SplashPageTemplate/AuthorCard/AuthorCardButton';

const DefaultButtonBlock: React.FC<IDefaultButtonBlock> = ({
  splashData,
  whatSplashPage
}) => {
  const {
    button1,
    button2,
    button3,
    purchaseButton,
    buttonLabel,
    customStyle
  } = splashData || {};

  const { connectUserData } = useConnectUser();

  return (
    <div className="button-wrapper">
      {purchaseButton?.buttonComponent !== undefined && (
        <purchaseButton.buttonComponent
          {...{
            ...purchaseButton,
            connectUserData,
            buttonLabel,
            customStyle
          }}
        />
      )}
      <div className="button-row-0">
        {button1 && (
          <AuthorCardButton
            buttonData={button1}
            whatSplashPage={whatSplashPage}
          />
        )}
      </div>
      <div className="button-row-1">
        {button2 && (
          <AuthorCardButton
            buttonData={button2}
            whatSplashPage={whatSplashPage}
          />
        )}
        {button3 && (
          <AuthorCardButton
            buttonData={button3}
            whatSplashPage={whatSplashPage}
          />
        )}
      </div>
    </div>
  );
};

export default DefaultButtonBlock;
