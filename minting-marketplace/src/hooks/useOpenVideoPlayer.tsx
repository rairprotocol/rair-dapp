import { useState } from 'react';

export type TUseOpenVideoPlayer = [
  boolean,
  (value: boolean) => void,
  () => void
];

export const useOpenVideoPlayer = (): TUseOpenVideoPlayer => {
  const [openVideoplayer, setOpenVideoPlayer] = useState<boolean>(false);

  const handlePlayerClick = () => {
    setOpenVideoPlayer(true);
  };

  return [openVideoplayer, setOpenVideoPlayer, handlePlayerClick];
};
