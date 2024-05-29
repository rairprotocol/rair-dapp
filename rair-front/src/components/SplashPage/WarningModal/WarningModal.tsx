import React from 'react';

import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import { IWarningModal } from '../splashPage.types';

import warning1 from './../images/splashPageImages/warning_1.webp';
import warning2 from './../images/splashPageImages/warning_2.webp';

const WarningModal: React.FC<IWarningModal> = ({ className, bad, good }) => {
  return (
    <div
      className={
        className ? `main-wrapper-nyc-${className}` : 'main-wrapper-nyc'
      }>
      <div className={bad ? bad : 'bad'}>
        <h3>Bad don&#8219;t sign</h3>
        <ImageLazy src={warning1} alt="Bad don&#8219;t sign" />
      </div>
      <div className={good ? good : 'good'}>
        <h3>Good safe to sign</h3>
        <ImageLazy src={warning2} alt="Good safe to sign" />
      </div>
    </div>
  );
};

export default WarningModal;
