import React from 'react';

import { ITitleSingleTokenView } from '../../mockupPage.types';

export const TitleSingleTokenView: React.FC<ITitleSingleTokenView> = ({
  title,
  primaryColor
}) => {
  return (
    <div
      className="main-tab-description"
      style={{
        color: `${primaryColor === 'rhyno' ? 'var(--charcoal)' : '#FFFFFF'}`
      }}>
      {title}
    </div>
  );
};
