import { Box, LinearProgress, LinearProgressProps } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useAppSelector } from '../../../hooks/useReduxHooks';

const LinearProgressWithLabel = (
  props: LinearProgressProps & { value: number }
) => {
  const { primaryColor } = useAppSelector((store) => store.colors);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 30 }}>
        <Typography
          style={{
            color: `${primaryColor === 'rhyno' ? '#000' : '#fff'}`
          }}
          variant="body2"
          color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;
