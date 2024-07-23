import React from 'react';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { INotCommercialTemplate2 } from '../splashPage.types';

import './NotCommercial-2.css';

const NotCommercialTemplate2: React.FC<INotCommercialTemplate2> = ({
  primaryColor,
  NFTName
}) => {
  return (
    <div
      className="container-commercial-2"
      style={{
        background: `${primaryColor === 'rhyno' ? '#aeaeae' : '#151415'}`
      }}>
      <div className="title-non-commercial">
        Your {NFTName} is released under Attribution-NonCommercial 4.0
      </div>
      <div className="non-commercial-content">
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#FFFFFF'}`
          }}>
          You are free to:
        </p>
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#FFFFFF'}`
          }}>
          <FontAwesomeIcon
            icon={faDiamond}
            style={{ margin: '0 12px 0 0', color: '#4099F1' }}
          />
          <b>Share</b> — copy and redistribute the material in any medium or
          format
        </p>
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#FFFFFF'}`
          }}>
          <FontAwesomeIcon
            icon={faDiamond}
            style={{ margin: '0 12px 0 0', color: '#4099F1' }}
          />
          <b>Adapt</b> — remix, transform, and build upon the material
        </p>
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#FFFFFF'}`
          }}>
          The licensor cannot revoke these freedoms as long as you follow the
          license terms.
        </p>
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#FFFFFF'}`
          }}>
          Under the following terms:
        </p>
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#FFFFFF'}`
          }}>
          <FontAwesomeIcon
            icon={faDiamond}
            style={{ margin: '0 12px 0 0', color: '#C776D7' }}
          />
          <b>Attribution</b> — You must give appropriate credit, provide a link
          to the license, and indicate if changes were made. You may do so in
          any reasonable manner, but not in any way that suggests the licensor
          endorses you or your use.
        </p>

        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#FFFFFF'}`
          }}>
          {/* className="non-commercial-par-under"> */}
          <FontAwesomeIcon
            icon={faDiamond}
            style={{ margin: '0 12px 0 0', color: '#C776D7' }}
          />
          <b>NonCommercial</b> — You may not use the material for commercial
          purposes.
        </p>
      </div>
    </div>
  );
};

export default NotCommercialTemplate2;
