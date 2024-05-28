import { CircularProgress } from '@mui/material';

const LoadingComponent = ({ size = 100, classes = 'list-wrapper-empty' }) => {
  return (
    <div className={classes}>
      {import.meta.env.VITE_TESTNET === 'true' ? (
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
