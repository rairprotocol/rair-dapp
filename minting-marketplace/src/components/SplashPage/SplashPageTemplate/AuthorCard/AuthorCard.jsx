import React from 'react'
import DocumentIcon from "../../../../images/documentIcon.svg";
import './AuthorCard.css'

const AuthorCard = ({ formHyperlink, splashData }) => {
  const {title, description, backgroundImage, buttonColor, buttonLabel} = splashData
    return (
        <div 
            className="template-author-card"
            style={{backgroundImage: 'url(' + backgroundImage + ')',}}
        >
            <div className="block-splash">
            <div className="text-splash">
              <div className="title-splash">
                <h3 className="text-gradient">
                  {title}
                </h3>
              </div>
              <div className="text-description">
              {description}
              </div>
              <div className="btn-submit-with-form">
                <button 
                onClick={() => formHyperlink()}
                style={{
                  background: buttonColor
                }}
                >
                  <img
                    className="metamask-logo"
                    src={DocumentIcon}
                    alt="form-logo"
                  />{" "}
                  {buttonLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
    )
}

export default AuthorCard;
