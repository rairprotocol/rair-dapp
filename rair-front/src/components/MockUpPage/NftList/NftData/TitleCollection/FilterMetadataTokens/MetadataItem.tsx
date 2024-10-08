import React, { useCallback, useEffect, useState } from 'react';

import useWindowDimensions from '../../../../../../hooks/useWindowDimensions';
import { TooltipBox } from '../../../../../common/Tooltip/TooltipBox';

const MetadataItem = ({
  index,
  item,
  setSelectedAttributeValues,
  selectedAttributeValues
}) => {
  const [checkName, setCheckName] = useState<boolean>(false);

  const { width } = useWindowDimensions();
  const isMobileDesign = width < 540;

  const toggleMetadata = useCallback(() => {
    if (selectedAttributeValues && selectedAttributeValues.length) {
      const result = selectedAttributeValues.filter(
        (el) => el.name === item.name
      );

      if (result && result.length > 0) {
        const array = selectedAttributeValues.filter(
          (el) => el.name !== item.name
        );
        setSelectedAttributeValues(array);
      } else {
        const array = selectedAttributeValues;
        setSelectedAttributeValues(array.concat([item]));
      }
    } else {
      setSelectedAttributeValues([item]);
    }
  }, [selectedAttributeValues, setSelectedAttributeValues, item]);

  useEffect(() => {
    if (selectedAttributeValues && selectedAttributeValues.length) {
      const result = selectedAttributeValues.filter(
        (el) => el.name === item.name
      );

      if (result && result.length > 0) {
        setCheckName(true);
      } else {
        setCheckName(false);
      }
    } else {
      setCheckName(false);
    }
  }, [item.name, selectedAttributeValues]);

  return (
    <div
      key={index}
      onClick={toggleMetadata}
      className={`custom-desc-to-offer nft-data-page-main-properties filter-metadata-block-titleCollection ${
        checkName && 'activeMetadata'
      } ${import.meta.env.VITE_TESTNET === 'true' ? 'hotdrops' : ''}`}>
      <div
        className="custom-offer-percents"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
        <div className="text-bold">
          {item.name.length > 8 && !isMobileDesign ? (
            <>
              <TooltipBox title={item.name}>
                <>{`${item.name.slice(0, 6)}...`}</>
              </TooltipBox>
            </>
          ) : (
            `${item.name}`
          )}
        </div>
        <div className="custom-offer-percents-percent">
          {item.values.length}
        </div>
      </div>
    </div>
  );
};

export default MetadataItem;
