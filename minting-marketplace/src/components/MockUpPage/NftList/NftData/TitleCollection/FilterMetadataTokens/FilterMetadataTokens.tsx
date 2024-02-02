import React from 'react';

import MetadataItem from './MetadataItem';

const FilterMetadataTokens = ({
  selectedData,
  textColor,
  index,
  setSelectedAttributeValues,
  selectedAttributeValues
}) => {
  return (
    <div
      className={`properties-data ${
        import.meta.env.VITE_HOTDROPS === 'true' ? 'hotdrops' : ''
      }`}>
      {selectedData && (
        <>
          <MetadataItem
            key={index}
            index={index}
            textColor={textColor}
            item={selectedData}
            setSelectedAttributeValues={setSelectedAttributeValues}
            selectedAttributeValues={selectedAttributeValues}
          />
        </>
      )}
    </div>
  );
};

export default FilterMetadataTokens;
