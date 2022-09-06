//@ts-nocheck
import React from 'react';

const ButtonHelp = ({
  toggleCheckList,
  backgroundButton,
  backgroundButtonText
}) => {
  return (
    <button
      className="btn-help"
      onClick={() => toggleCheckList()}
      style={{ background: backgroundButton }}>
      {backgroundButtonText || 'Need help?'}
    </button>
  );
};

export default ButtonHelp;
