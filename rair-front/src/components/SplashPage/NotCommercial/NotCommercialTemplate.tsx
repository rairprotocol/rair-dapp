import React from 'react';

import { INotCommercialTemplate } from '../splashPage.types';

import './NotCommercial.css';

const NotCommercialTemplate: React.FC<INotCommercialTemplate> = ({
  primaryColor,
  NFTName
}) => {
  return (
    <div
      className="container-commercial"
      style={{
        background: `${primaryColor === 'rhyno' ? '#aeaeae' : '#626262'}`
      }}>
      <div className="title-non-commercial">
        Your {NFTName} is released under Attribution-NonCommercial 4.0
      </div>
      <div className="non-commercial-content">
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
          }}>
          You are free to:
        </p>
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
          }}>
          <b>Share</b> — copy and redistribute the material in any medium or
          format
        </p>
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
          }}>
          <b>Adapt</b> — remix, transform, and build upon the material
        </p>
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
          }}>
          The licensor cannot revoke these freedoms as long as you follow the
          license terms.
        </p>
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
          }}>
          Under the following terms:
        </p>
        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
          }}>
          <b>Attribution</b> — You must give appropriate credit, provide a link
          to the license, and indicate if changes were made. You may do so in
          any reasonable manner, but not in any way that suggests the licensor
          endorses you or your use.
        </p>

        <p
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
          }}
          className="non-commercial-par-under">
          <b>NonCommercial</b> — You may not use the material for commercial
          purposes.
        </p>
      </div>
    </div>
  );
};

export default NotCommercialTemplate;
