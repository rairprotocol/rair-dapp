import React, { useCallback } from 'react';

import { TCardButton } from './splashPage.types.test';

const CardButton: React.FC<TCardButton> = ({
  className,
  title,
  buttonAction
}) => {
  const handleButtonClick = useCallback(() => buttonAction?.(), [buttonAction]);

  return (
    <button className={className} onClick={handleButtonClick}>
      {title}
    </button>
  );
};

export default CardButton;
