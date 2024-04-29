import React, { useState } from 'react';
import { Tooltip } from '@mui/material';

import { ISingleTokenViewProperties } from '../../mockupPage.types';

const SingleTokenViewProperties: React.FC<ISingleTokenViewProperties> = ({
  selectedData,
  textColor
}) => {
  const [toolTipMobile, setToolTipMobile] = useState<boolean>(false);

  // unused code
  // const randomInteger = (min: number, max: number) => {
  //   const rand = min + Math.random() * (max + 1 - min);
  //   return Math.floor(rand);
  // };

  const toggleToolTipMobile = () => {
    setToolTipMobile((prev) => !prev);
  };

  const percentToRGB = (percent: string) => {
    const percentNumber = parseInt(percent);
    if (percentNumber) {
      if (percentNumber < 15) {
        return '#95F619';
      } else if (15 <= percentNumber && percentNumber < 35) {
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
                {item?.value.length > 12 ? (
                  item.value && (
                    <Tooltip
                      onClose={toggleToolTipMobile}
                      onOpen={toggleToolTipMobile}
                      open={toolTipMobile}
                      placement="left"
                      arrow
                      title={item.value}>
                      <div className="text-bold" onClick={toggleToolTipMobile}>
                        {`${toUpper(
                          item?.value.toString().toLowerCase()
                        )?.slice(0, 10)}`}
                        ...
                      </div>
                    </Tooltip>
                  )
                ) : (
                  <div
                    className="text-bold"
                    title={toUpper(item?.value.toString().toLowerCase())}>
                    {`${toUpper(item?.value.toString().toLowerCase())}`}
                  </div>
                )}
                <div className="custom-offer-percents-percent">
                  {item.percentage}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SingleTokenViewProperties;
