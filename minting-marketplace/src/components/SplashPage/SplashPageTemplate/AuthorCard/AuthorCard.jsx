import React from 'react'
import DocumentIcon from "../../../../images/documentIcon.svg";
import './AuthorCard.css'



const hyperlink = (url) => {
  window.open(url);
}


const AuthorCardButton = ({ buttonData }) => {
  const { buttonLabel, buttonColor, buttonImg, buttonLink } = buttonData
  return (
    <div className="btn-submit-with-form">
      <button
        onClick={() => hyperlink(buttonLink)}
        style={{
          background: buttonColor
        }}
      >
        <img
          className="metamask-logo"
          src={buttonImg}
          alt="form-logo"
        />{" "}
        {buttonLabel}
      </button>
    </div>
  )
}

const AuthorCard = ({ splashData, connectUserData }) => {
  const { title, titleColor, description, backgroundImage, button1, button2, purchaseButton } = splashData
  return (
    <div
      className="template-author-card"
      style={{ backgroundImage: 'url(' + backgroundImage + ')', }}
    >
      <div className="block-splash">
        <div className="text-splash">
          <div className="title-splash">
            <h3
              className="text-gradient-template"
              style={{
                color: titleColor
              }}
            >
              {title}
            </h3>
          </div>
          <div className="text-description">
            {description}
          </div>
          <div className='button-wrapper'>
            {purchaseButton && <purchaseButton.buttonComponent
              {...{...purchaseButton, connectUserData}}
            />}
            {button1 && <AuthorCardButton buttonData={button1} />}
            {button2 && <AuthorCardButton buttonData={button2} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorCard;
