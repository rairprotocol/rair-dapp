import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';

const ErrorFallback: React.FC = () => {
  const { primaryColor, secondaryColor, textColor, primaryButtonColor } =
    useSelector<RootState, ColorStoreType>((store) => store.colorStore);
  return (
    <div
      className="not-found-page"
      style={{
        backgroundColor: secondaryColor,
        width: '100vw',
        height: '100vh'
      }}>
      <h3>
        <span style={{ color: primaryColor }}>Sorry!</span>
      </h3>
      <p style={{ color: textColor }}>An error has ocurred</p>
      <button
        className="btn rair-button"
        style={{ color: textColor, background: primaryButtonColor }}
        onClick={() => {
          window.location.reload();
        }}>
        Reload
      </button>
    </div>
  );
};

export default ErrorFallback;
