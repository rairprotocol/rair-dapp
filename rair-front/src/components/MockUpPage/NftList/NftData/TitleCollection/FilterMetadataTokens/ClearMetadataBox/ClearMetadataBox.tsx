//@ts-nocheck
import React from 'react';

import ClearMetadataItem from './ClearMetadataItem';

const ClearMetadataBox = ({
  filteredDataAttributes,
  setSelectedAttributeValues,
  getResetTokens
}) => {
  return (
    <div
      className="clear-filter-wrapper"
      style={{
        display: 'flex'
      }}>
      {filteredDataAttributes &&
        filteredDataAttributes.length > 0 &&
        filteredDataAttributes.map((meta, index) => {
          return (
            <React.Fragment key={index}>
              {meta.values.map((val, i) => {
                const clickProperty = () => {
                  const result = filteredDataAttributes.map(function (element) {
                    const newItem = { ...element };

                    newItem.values = element.values.map(function (valueItem) {
                      if (valueItem.value === val.value) {
                        const newValueItem = { ...valueItem };
                        newValueItem.active = !newValueItem.active;
                        return newValueItem;
                      }
                      return valueItem;
                    });

                    return newItem;
                  });
                  setSelectedAttributeValues(result);
                };

                if (val.active) {
                  return (
                    <ClearMetadataItem
                      getResetTokens={getResetTokens}
                      key={i}
                      clickProperty={clickProperty}
                      meta={meta}
                      val={val}
                      filteredDataAttributes={meta.values}
                    />
                  );
                }
              })}
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default ClearMetadataBox;
