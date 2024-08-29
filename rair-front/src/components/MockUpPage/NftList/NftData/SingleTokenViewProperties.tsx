import { FC, useState } from 'react';
import { Tooltip } from '@mui/material';

import { useAppSelector } from '../../../../hooks/useReduxHooks';
import { ISingleTokenViewProperties } from '../../mockupPage.types';

const SingleTokenViewProperties: FC<ISingleTokenViewProperties> = ({
  selectedData
}) => {
  const [toolTipMobile, setToolTipMobile] = useState<boolean>(false);
  const { textColor } = useAppSelector((store) => store.colors);

  const toggleToolTipMobile = () => {
    setToolTipMobile((prev) => !prev);
  };

  // const percentToRGB = (percent: string) => {
  //   const percentNumber = parseInt(percent);
  //   if (percentNumber) {
  //     if (percentNumber < 15) {
  //       return '#95F619';
  //     } else if (15 <= percentNumber && percentNumber < 35) {
  //       return '#F6ED19';
  //     } else {
  //       return '#F63419';
  //     }
  //   }
  // };

  const toUpper = (string?: string) => {
    if (string) {
      return string[0].toUpperCase() + string.slice(1);
    }
    return '';
  };

  if (!selectedData.attributes) {
    return <></>;
  }

  return (
    <div className="properties-data">
      {selectedData.attributes
        .filter((item) => {
          return (
            !item.trait_type ||
            !item.value ||
            !['External URL', 'external_url'].includes(item.trait_type)
          );
        })
        .map((item, index) => {
          if (!item.trait_type || !item.value) {
            return;
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
                title={toUpper(item.trait_type.toString().toLowerCase())}>
                {item.trait_type.toUpperCase()}
              </div>
              <div className="custom-offer-percents">
                {item?.value?.length > 12 ? (
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
                    title={toUpper(item?.value?.toString()?.toLowerCase())}>
                    {toUpper(item?.value?.toString()?.toLowerCase())}
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
