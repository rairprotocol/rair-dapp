import React, { useEffect, useState } from 'react';

const ClearMetadataItem = ({
  clickProperty,
  meta,
  val,
  getResetTokens,
  filteredDataAttributes
}) => {
  const [clearActive, setClearActive] = useState(false);

  console.info(filteredDataAttributes, 'filteredDataAttributes');

  useEffect(() => {
    getResetTokens();
  }, [getResetTokens, val]);

  return (
    <button
      style={{
        marginBottom: '1rem'
      }}
      onClick={() => {
        setClearActive(true);
        clickProperty();
      }}
      className="clear-filter">{`${meta.name}: ${val.value}`}</button>
  );
};

export default ClearMetadataItem;
