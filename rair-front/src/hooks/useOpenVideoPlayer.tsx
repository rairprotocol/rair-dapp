import { useState } from 'react';

export type TUseOpenVideoPlayer = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  () => void
];

export const useOpenVideoPlayer = (): TUseOpenVideoPlayer => {
  const [openVideoplayer, setOpenVideoPlayer] = useState<boolean>(false);

  const handlePlayerClick = () => {
    setOpenVideoPlayer(true);
  };

  return [openVideoplayer, setOpenVideoPlayer, handlePlayerClick];
};
