import { CircularProgress } from '@mui/material';

const LoadingComponent = () => {
  return (
    <div className="list-wrapper-empty">
      {process.env.REACT_APP_HOTDROPS === 'true' ? (
        <CircularProgress
          sx={{ color: 'var(--hot-drops-light)' }}
          size={100}
          thickness={4.6}
        />
      ) : (
        <CircularProgress
          sx={{ color: '#E882D5' }}
          size={100}
          thickness={4.6}
        />
      )}
    </div>
  );
};

export default LoadingComponent;
