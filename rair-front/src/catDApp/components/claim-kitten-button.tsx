import { useContext, useState } from "react";
import { GameContext } from "../contexts/game-context";
import { contract } from "../utils/constants";
import { TransactionButton } from "thirdweb/react";
import { claimKitten } from "../thirdweb/84532/0x5ca3b8e5b82d826af6e8e9ba9e4e8f95cbc177f4";
import useServerSettings from "../../components/adminViews/useServerSettings";

const ClaimKittenButton: React.FC = () => {
  const { refetch } = useContext(GameContext);
  const [error, setError] = useState<Error | null>(null);
  const {signupMessage} = useServerSettings();

  return (
    <div className="flex flex-col items-center w-full">
      <TransactionButton
        transaction={() =>
          claimKitten({
            contract,
          })
        }
        onError={(error) => setError(error)}
        onClick={() => setError(null)}
        onTransactionConfirmed={(resut) => {
          refetch();
        }}
      >
        {signupMessage}
      </TransactionButton>
      {error && (
        <p className="mt-2 text-xs first-letter:capitalize text-red-400 max-w-xs text-center">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default ClaimKittenButton;
