import { useState } from 'react';

import { useAppSelector } from '../../../../../../../hooks/useReduxHooks';

const ClearMetadataItem = ({ clickProperty, meta, val }) => {
  const [, /*clearActive*/ setClearActive] = useState(false);

  const { primaryColor, textColor, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );

  return (
    <button
      onClick={() => {
        setClearActive(true);
        clickProperty();
      }}
      className="clear-filter"
      style={{
        marginBottom: '1rem',
        background: `${
          primaryColor === '#dedede'
            ? import.meta.env.VITE_TESTNET === 'true'
              ? 'var(--hot-drops)'
              : 'linear-gradient(to right, #e882d5, #725bdb)'
            : import.meta.env.VITE_TESTNET === 'true'
              ? primaryButtonColor ===
                'linear-gradient(to right, #e882d5, #725bdb)'
                ? 'var(--hot-drops)'
                : primaryButtonColor
              : primaryButtonColor
        }`,
        color: textColor
      }}>{`${meta.name}: ${val.value}`}</button>
  );
};

export default ClearMetadataItem;
