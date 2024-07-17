import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';

const LoadingComponent = ({ size = 100, classes = 'list-wrapper-empty' }) => {
  const { iconColor } =
    useSelector<RootState, ColorStoreType>((store) => store.colorStore);

  return (
    <div className={classes}>
      {import.meta.env.VITE_TESTNET === 'true' ? (
        <CircularProgress
          sx={{ color: `${iconColor === '#1486c5' ? '#F95631' : iconColor}` }}
          size={size}
          thickness={4.6}
        />
      ) : (
        <CircularProgress
          sx={{ color: `${
            iconColor === '#1486c5' ? '#E882D5' : iconColor}` }}
          size={size}
          thickness={4.6}
        />
      )}
    </div>
  );
};

export default LoadingComponent;
