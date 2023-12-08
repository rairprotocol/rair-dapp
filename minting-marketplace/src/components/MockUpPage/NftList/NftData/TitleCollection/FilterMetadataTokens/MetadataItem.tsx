import React, { useCallback, useEffect, useState } from 'react';

const MetadataItem = ({
  index,
  textColor,
  item,
  setSelectedAttributeValues,
  selectedAttributeValues
}) => {
  const [checkName, setCheckName] = useState<boolean>(false);

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
      }`}
      style={{
        color: textColor,
        width: 120,
        height: 48,
        padding: 0,
        cursor: 'pointer'
      }}>
      <div
        className="custom-offer-percents"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
        <div className="text-bold">{item.name}</div>
        <div
          className="custom-offer-percents-percent"
          style={{
            color: '#fff'
          }}>
          {item.values.length}
        </div>
      </div>
    </div>
  );
};

export default MetadataItem;
