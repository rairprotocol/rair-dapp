import { useContext } from "react";
import { GameContext } from "../contexts/game-context";
import { useActiveAccount, useEnsName } from "thirdweb/react";
import { client } from "../utils/constants";
import { shortenAddress } from "../utils/utils";

export const Address: React.FC<{
	address: string;
}> = ({ address }) => {
	const currentAddress = useActiveAccount()?.address;
	const { setTargetAddress } = useContext(GameContext);
	const isOwnAddress = currentAddress === address;
	const ensNameQuery = useEnsName({ client, address });

	return (
		<button
			className={`cursor-pointer ${isOwnAddress ? "text-green-700" : ""}`}
			onClick={() => setTargetAddress(address)}
			type="button"
		>
			{currentAddress === address
				? "You"
				: ensNameQuery.data || shortenAddress(address)}
		</button>
	);
};
