import { createContext } from "react";
import type { NFT } from "thirdweb";

type GameContextType = {
  targetAddress: string;
  setTargetAddress: React.Dispatch<React.SetStateAction<string>>;
  refetch: Function;
  nfts: NFT[];
  playerScore: bigint;
};

export const GameContext = createContext<GameContextType>({
  targetAddress: "",
  setTargetAddress: () => {},
  refetch: () => {},
  nfts: [],
  playerScore: 0n,
});
