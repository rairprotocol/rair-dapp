import React from 'react';

import MetadataAttributesPropertyItem from './MetadataAttributesPropertyItem';

const MetadataAttributesProperties = ({
  filteredDataAttributes,
  setSelectedAttributeValues
}) => {
  return (
    <div className="filter-collection-attributes-container">
      {filteredDataAttributes &&
        filteredDataAttributes.map((item, indexID) => {
          return (
            <React.Fragment key={indexID}>
              {item.values.map((el, index) => {
                return (
                  <MetadataAttributesPropertyItem
                    setSelectedAttributeValues={setSelectedAttributeValues}
                    key={index}
                    item={el}
                    index={index}
                    quantity={item.quantity[index]}
                    filteredDataAttributes={filteredDataAttributes}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default MetadataAttributesProperties;
