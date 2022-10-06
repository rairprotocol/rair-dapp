import React from 'react';

import { IButtonHelp } from '../splashPage.types';

const ButtonHelp: React.FC<IButtonHelp> = ({
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
