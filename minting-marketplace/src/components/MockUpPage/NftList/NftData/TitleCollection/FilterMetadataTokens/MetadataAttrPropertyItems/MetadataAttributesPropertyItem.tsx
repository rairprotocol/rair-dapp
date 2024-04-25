import React, { useCallback, useState } from 'react';

import useWindowDimensions from '../../../../../../../hooks/useWindowDimensions';
import { TooltipBox } from '../../../../../../common/Tooltip/TooltipBox';

const MetadataAttributesPropertyItem = ({
  item,
  index,
  quantity,
  setSelectedAttributeValues,
  filteredDataAttributes
}) => {
  const { width } = useWindowDimensions();
  const isMobileDesign = width < 540;
  const [, /*activeMetadata*/ setActiveMetadata] = useState<boolean>(false);

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
      className={`custom-desc-to-offer nft-data-page-main-properties filter-metadata-block-titleCollection ${
        item.active && 'activeMetadata'
      } ${import.meta.env.VITE_TESTNET === 'true' ? 'hotdrops' : ''}`}
      key={index}>
      {item.value.length > 7 && !isMobileDesign ? (
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
