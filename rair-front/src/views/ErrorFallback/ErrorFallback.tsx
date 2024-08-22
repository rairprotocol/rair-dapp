import { FC } from 'react';

import { useAppSelector } from '../../hooks/useReduxHooks';

const ErrorFallback: FC = () => {
  const { primaryColor, textColor, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );
  return (
    <div
      className="not-found-page"
      style={{
        backgroundColor: textColor,
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
