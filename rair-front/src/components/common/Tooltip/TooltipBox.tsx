import Tooltip from '@mui/material/Tooltip';

import { ITooltipBox } from './types';

export const TooltipBox: React.FC<ITooltipBox> = ({
  title,
  children,
  enterDelay
}) => {
  return (
    <Tooltip
      disableTouchListener
      enterDelay={enterDelay ? enterDelay : 500}
      leaveDelay={200}
      title={title}>
      {children}
    </Tooltip>
  );
};
