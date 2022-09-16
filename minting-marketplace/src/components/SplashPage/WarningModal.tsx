import React from 'react';
import warning1 from './images/warning_1.png';
import warning2 from './images/warning_2.png';
import { IWarningModal } from './splashPage.types';

const WarningModal: React.FC<IWarningModal> = ({ className, bad, good }) => {
  return (
    <div
      className={
        className ? `main-wrapper-nyc-${className}` : 'main-wrapper-nyc'
      }>
      <div className={bad ? bad : 'bad'}>
        <h3>Bad don&#8219;t sign</h3>
        <img src={warning1} alt="Bad don&#8219;t sign" />
      </div>
      <div className={good ? good : 'good'}>
        <h3>Good safe to sign</h3>
        <img src={warning2} alt="Good safe to sign" />
      </div>
    </div>
  );
};

export default WarningModal;
