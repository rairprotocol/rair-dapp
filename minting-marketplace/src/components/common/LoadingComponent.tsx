import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';

const LoadingComponent = ({ size = 100, classes = 'list-wrapper-empty' }) => {
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  return (
    <div className={classes}>
      {import.meta.env.VITE_HOTDROPS === 'true' ? (
        <CircularProgress
          sx={{ color: 'var(--hot-drops-light)' }}
          size={size}
          thickness={4.6}
        />
      ) : (
        <CircularProgress
          sx={{ color: '#E882D5' }}
          size={size}
          thickness={4.6}
        />
      )}
    </div>
  );
};

export default LoadingComponent;
