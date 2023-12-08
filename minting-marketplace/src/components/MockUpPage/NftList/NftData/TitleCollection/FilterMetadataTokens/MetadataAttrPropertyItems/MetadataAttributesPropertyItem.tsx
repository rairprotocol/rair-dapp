import React, { useCallback, useState } from 'react';

import { TooltipBox } from '../../../../../../common/Tooltip/TooltipBox';

const MetadataAttributesPropertyItem = ({
  item,
  index,
  quantity,
  setSelectedAttributeValues,
  filteredDataAttributes
}) => {
  const [activeMetadata, setActiveMetadata] = useState<boolean>(false);

  const clickProperty = useCallback(() => {
    const result = filteredDataAttributes.map(function (element) {
      const newItem = { ...element };

      newItem.values = element.values.map(function (valueItem) {
        if (valueItem.value === item.value) {
          const newValueItem = { ...valueItem };

          newValueItem.active = !newValueItem.active;

          return newValueItem;
        }

        return valueItem;
      });

      return newItem;
    });
    setSelectedAttributeValues(result);
    setActiveMetadata((prev) => !prev);
  }, [filteredDataAttributes, item.value, setSelectedAttributeValues]);

  return (
    <div
      onClick={clickProperty}
      style={{
        width: '110px',
        height: '48px'
      }}
      className={`custom-desc-to-offer nft-data-page-main-properties filter-metadata-block-titleCollection ${
        activeMetadata && 'activeMetadata'
      }`}
      key={index}>
      {item.value.length > 7 ? (
        <>
          <TooltipBox title={item.value}>
            {`${item.value.slice(0, 4)}...(${quantity})`}
          </TooltipBox>
        </>
      ) : (
        `${item.value}(${quantity})`
      )}
    </div>
  );
};

export default MetadataAttributesPropertyItem;
