//@ts-nocheck
import React from 'react';
import ButtonHelp from '../../PurchaseChecklist/ButtonHelp';
import './AuthorCard.css';
import AuthorCardButton from './AuthorCardButton';

const AuthorCard = ({
  splashData,
  toggleCheckList,
  customButtonBlock,
  connectUserData,
  whatSplashPage
}) => {
  const {
    title,
    subtitle,
    titleColor,
    titleImage,
    description,
    textBottom,
    textDescriptionCustomStyles,
    backgroundImage,
    cardFooter,
    buttonBackgroundHelp,
    customStyle
  } = splashData;

  const DefaultButtonBlock = ({
    splashData,
    connectUserData,
    whatSplashPage
  }) => {
    const { button1, button2, button3, purchaseButton, buttonLabel } =
      splashData;

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

  return (
    <div
      className="template-author-card"
      style={{ backgroundImage: 'url(' + backgroundImage + ')' }}>
      {toggleCheckList && (
        <ButtonHelp
          backgroundButton={buttonBackgroundHelp}
          toggleCheckList={toggleCheckList}
        />
      )}
      <div className="block-splash">
        <div className="text-splash">
          <div className="title-splash">
            {/* <button
							className="btn-help"
							onClick={() => toggleCheckList()}
						>
							Need help?
						</button> */}
            <h3
              className="text-gradient-template"
              style={{
                color: titleColor
              }}>
              {title}
            </h3>
            {subtitle && <h3 className="author-card-subtitle"> {subtitle} </h3>}
            {titleImage && (
              <img
                className="author-card-title-image"
                src={titleImage}
                alt="title-image"
              />
            )}
          </div>
          {textBottom || (
            <div
              className="text-description"
              style={textDescriptionCustomStyles}>
              {description}
            </div>
          )}
          {customButtonBlock ? (
            customButtonBlock
          ) : (
            <DefaultButtonBlock
              splashData={splashData}
              connectUserData={connectUserData}
              whatSplashPage={whatSplashPage}
            />
          )}
          {textBottom && (
            <div
              className="text-description"
              style={textDescriptionCustomStyles}>
              {description}
            </div>
          )}
        </div>
        {cardFooter && <div className="card-footer">{cardFooter}</div>}
      </div>
    </div>
  );
};

export default AuthorCard;
