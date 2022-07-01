//@ts-nocheck
import React from 'react';
import ButtonHelp from '../../PurchaseChecklist/ButtonHelp';
// import DocumentIcon from "../../../../images/documentIcon.svg";
import './AuthorCard.css';

const hyperlink = (url) => {
  window.open(url);
};

const AuthorCardButton = ({ buttonData, whatSplashPage }) => {
  const { buttonLabel, buttonColor, buttonImg, buttonLink, buttonAction } =
    buttonData;
  return (
    <div className="btn-submit-with-form">
      <button
        className={whatSplashPage ? whatSplashPage : ''}
        onClick={() => {
          if (buttonAction) {
            buttonAction();
          } else {
            hyperlink(buttonLink);
          }
        }}
        style={{
          background: buttonColor
        }}>
        {buttonImg && (
          <img className="metamask-logo" src={buttonImg} alt="form-logo" />
        )}{' '}
        {buttonLabel}
      </button>
    </div>
  );
};

const AuthorCard = ({
  splashData,
  connectUserData,
  toggleCheckList,
  whatSplashPage
}) => {
  const {
    title,
    titleColor,
    titleImage,
    description,
    backgroundImage,
    cardFooter,
    button1,
    button2,
    button3,
    purchaseButton,
    buttonLabel,
    buttonBackgroundHelp
  } = splashData;

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
            {titleImage && (
              <img
                className="author-card-title-image"
                src={titleImage}
                alt="title-image"
              />
            )}
          </div>
          <div className="text-description">{description}</div>
          <div className="button-wrapper">
            {purchaseButton?.buttonComponent !== undefined && (
              <purchaseButton.buttonComponent
                {...{ ...purchaseButton, connectUserData, buttonLabel }}
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
        </div>
        {cardFooter && <div className="card-footer">{cardFooter}</div>}
      </div>
    </div>
  );
};

export default AuthorCard;
