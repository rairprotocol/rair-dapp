import React from 'react';

import { ITitleSingleTokenView } from '../../mockupPage.types';

export const TitleSingleTokenView: React.FC<ITitleSingleTokenView> = ({
  title,
  isDarkMode
}) => {
  return (
    <div
      className="main-tab-description"
      style={{
        color: `${!isDarkMode ? 'var(--charcoal)' : '#FFFFFF'}`
      }}>
      {title}
    </div>
  );
};
