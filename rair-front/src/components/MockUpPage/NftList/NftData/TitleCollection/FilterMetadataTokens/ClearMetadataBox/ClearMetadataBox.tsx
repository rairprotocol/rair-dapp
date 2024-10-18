//@ts-nocheck
import React from 'react';
import useWindowDimensions from '../../../../../../../hooks/useWindowDimensions';

import ClearMetadataItem from './ClearMetadataItem';

const ClearMetadataBox = ({
  filteredDataAttributes,
  setSelectedAttributeValues,
  getResetTokens,
  showTokenRef,
  getAllProduct,
  selectedAttributeValues
}) => {
  const { width } = useWindowDimensions();
  const isMobileDesign = width < 820;

  return (
    <div
      className="clear-filter-wrapper"
      style={{
        display: 'flex',
        fontSize: isMobileDesign && '12px'
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

                  getAllProduct(
                    '0',
                    showTokenRef.current.toString(),
                    selectedAttributeValues &&
                      selectedAttributeValues.length &&
                      selectedAttributeValues?.reduce((acc, item) => {
                        const { name, values } = item;
                        const newValue = values.filter((el) => el.active);

                        acc[name] = newValue.map((el) => el.value);
                        return acc;
                      }, {})
                  );
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
