import React from 'react';

import { ImageLazy } from '../../../MockUpPage/ImageLazy/ImageLazy';
import DefaultButtonBlock from '../../DefaultButtonBlock';
import ButtonHelp from '../../PurchaseChecklist/ButtonHelp';
import { IAuthorCard } from '../../splashPage.types';

import './AuthorCard.css';

const AuthorCard: React.FC<IAuthorCard> = ({
  splashData,
  toggleCheckList,
  customButtonBlock,
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
    buttonBackgroundHelp
  } = splashData || {};

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
            <h3
              className="text-gradient-template"
              style={{
                color: titleColor
              }}>
              {title}
            </h3>
            {subtitle && <h3 className="author-card-subtitle"> {subtitle} </h3>}
            {titleImage && (
              <ImageLazy
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
