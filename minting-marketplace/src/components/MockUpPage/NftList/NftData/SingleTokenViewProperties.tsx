import React from 'react';

import { ISingleTokenViewProperties } from '../../mockupPage.types';

const SingleTokenViewProperties: React.FC<ISingleTokenViewProperties> = ({
  selectedData,
  textColor
}) => {
  const randomInteger = (min: number, max: number) => {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  const percentToRGB = (percent: number) => {
    if (percent) {
      if (percent < 15) {
        return '#95F619';
      } else if (15 <= percent && percent < 35) {
        return '#F6ED19';
      } else {
        return '#F63419';
      }
    }
  };

  const toUpper = (string: string) => {
    if (string) {
      return string[0].toUpperCase() + string.slice(1);
    }
  };

  return (
    <div className="properties-data">
      {Object.keys(selectedData).length &&
        selectedData.attributes &&
        selectedData?.attributes.length > 0 &&
        selectedData?.attributes.map((item, index) => {
          if (
            item.trait_type === 'External URL' ||
            item.trait_type === 'external_url'
          ) {
            return null;
          }
          if (
            item.trait_type === 'image' ||
            item.trait_type === 'animation_url'
          ) {
            return (
              <div
                key={index}
                className="custom-desc-to-offer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  color: textColor,
                  textAlign: 'center'
                }}>
                <span>
                  {' '}
                  <a
                    className="custom-offer-pic-link"
                    style={{
                      color: textColor
                    }}
                    target="_blank"
                    rel="noreferrer"
                    href={item?.value}>
                    {toUpper(item?.trait_type)}
                  </a>
                </span>
              </div>
            );
          }
          const percent = randomInteger(1, 40);
          return (
            <div
              key={index}
              className="custom-desc-to-offer nft-data-page-main-properties"
              style={{
                color: textColor
              }}>
              <div
                className="property-title"
                title={toUpper(item?.trait_type.toString().toLowerCase())}>
                {`${item?.trait_type.toUpperCase()} `}
              </div>
              <div className="custom-offer-percents">
                <div
                  className="text-bold"
                  title={toUpper(item?.value.toString().toLowerCase())}>
                  {`${toUpper(item?.value.toString().toLowerCase())} `}
                </div>
                <div
                  className="custom-offer-percents-percent"
                  style={{
                    color: percentToRGB(percent)
                  }}>
                  {percent}%
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SingleTokenViewProperties;
