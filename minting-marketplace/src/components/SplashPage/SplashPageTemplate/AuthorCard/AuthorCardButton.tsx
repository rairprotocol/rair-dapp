import './AuthorCard.css';

const hyperlink = (url) => {
  window.open(url);
};

const AuthorCardButton = ({ buttonData, whatSplashPage }) => {
  const {
    buttonLabel,
    buttonColor,
    buttonBorder,
    buttonTextColor,
    buttonMarginTop,
    buttonMarginBottom,
    buttonImg,
    buttonCustomLogo,
    buttonLink,
    buttonAction
  } = buttonData;
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
          color: buttonTextColor,
          border: buttonBorder,
          background: buttonColor,
          marginTop: buttonMarginTop,
          marginBottom: buttonMarginBottom
        }}>
        {buttonCustomLogo}
        {buttonImg && (
          <img className="metamask-logo" src={buttonImg} alt="form-logo" />
        )}{' '}
        {buttonLabel}
      </button>
    </div>
  );
};

export default AuthorCardButton;
