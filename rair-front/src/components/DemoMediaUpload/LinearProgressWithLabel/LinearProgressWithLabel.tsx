import { useSelector } from 'react-redux';
import { Box, LinearProgress, LinearProgressProps } from '@mui/material';
import Typography from '@mui/material/Typography';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';

const LinearProgressWithLabel = (
  props: LinearProgressProps & { value: number }
) => {
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

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
