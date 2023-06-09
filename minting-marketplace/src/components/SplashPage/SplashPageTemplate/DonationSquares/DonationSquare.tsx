import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { v1 } from 'uuid';

import useConnectUser from '../../../../hooks/useConnectUser';
import PurchaseTokenButton from '../../../common/PurchaseToken';
import AuthorCardButton from '../AuthorCard/AuthorCardButton';

import './DonationSquare.css';

const DonationSquare = ({ donationSquareData, mobileView }) => {
  const {
    title,
    image,
    buttonData,
    textBoxArray,
    imageClass,
    buyFunctionality,
    offerIndexInMarketplace,
    contractAddress,
    switchToNetwork
  } = donationSquareData;

  const [open, setOpen] = useState(mobileView);
  const { connectUserData } = useConnectUser();

  const clickHandler = () => {
    if (!mobileView) {
      setOpen(!open);
    }
  };

  useEffect(() => {
    setOpen(mobileView);
  }, [mobileView]);

  const connectUserDataMain = connectUserData;

  return (
    <div className="donation-square" onClick={() => clickHandler()}>
      <div className="donation-square-title">{title}</div>
      {open ? (
        <>
          <div
            className={['donation-square-image', imageClass].join(' ')}
            style={{ backgroundImage: 'url(' + image + ')' }}
          />
          {buyFunctionality ? (
            <PurchaseTokenButton
              {...{
                customStyle: {
                  color: buttonData.buttonTextColor,
                  border: buttonData.buttonBorder,
                  background: buttonData.buttonColor,
                  marginTop: buttonData.buttonMarginTop,
                  marginBottom: buttonData.buttonMarginBottom,
                  width: '560px',
                  height: '126px',
                  font: 'normal 700 40px/28px Plus Jakarta Sans'
                },
                customWrapperClassName: 'btn-submit-with-form more-padding',
                contractAddress: contractAddress,
                requiredBlockchain: switchToNetwork,
                offerIndex: [offerIndexInMarketplace],
                connectUserData: connectUserDataMain,
                buttonLabel: buttonData.buttonLabel,
                diamond: true,
                customSuccessAction: (nextToken) =>
                  Swal.fire(
                    'Success',
                    `You own token #${nextToken}!`,
                    'success'
                  )
              }}
            />
          ) : (
            <AuthorCardButton
              buttonData={buttonData}
              whatSplashPage={'donation-square-button'}
            />
          )}
          <div className={['donation-square-textbox', imageClass].join(' ')}>
            <div
              className={['donation-square-inner-textbox', imageClass].join(
                ' '
              )}>
              {textBoxArray.map((row) => (
                <div key={v1()} className="donation-square-textbox-row">
                  {row}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DonationSquare;
