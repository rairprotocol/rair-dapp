import { useContext, useMemo } from "react";
import { GameContext } from "../contexts/game-context";
import Cat from "./cat";
import ClaimKittenButton from "./claim-kitten-button";
import {
	useActiveAccount,
	useReadContract,
	MediaRenderer,
} from "thirdweb/react";
import { balanceOf } from "thirdweb/extensions/erc1155";
import { client, contract } from "../utils/constants";

const Cats: React.FC = () => {
	const address = useActiveAccount()?.address;
	const { nfts, playerScore } = useContext(GameContext);

	const { cats, badges } = useMemo(
		() => ({
			cats: nfts.filter((nft) => Number(nft.id) < 3),
			badges: nfts.filter((nft) => Number(nft.id) > 2),
		}),
		[nfts],
	);

	const badgesQuantityQuery = useReadContract(balanceOf, {
		contract,
		owner: address || "",
		tokenId: 3n,
		queryOptions: {
			enabled: !!address,
		},
	});

	return (
		<div className="flex flex-col items-center w-full">
			<h1 className="font-bold sm:text-6xl text-4xl leading-none text-center tracking-tight">
				Your cats
			</h1>
			<p className="my-4 text-gray-500">
				<span className="tracking-wide mr-2">Total Points:</span>
				<span className="text-white">{playerScore.toString()}</span>
			</p>
			{badges.length > 0 && (
				<div className="flex flex-col items-center w-full">
					<p className="mt-4 text-gray-500">
						<span className="tracking-wide mr-2">Cats Destroyed:</span>
						<span className="text-white">
							{badgesQuantityQuery.data?.toString()}
						</span>
					</p>
					<div className="flex flex-wrap max-w-xs gap-2 my-4 items-center justify-center">
						{[
							...Array(
								Math.min(
									Number.parseInt(badgesQuantityQuery.data?.toString() || "0"),
									8,
								),
							).keys(),
						].map((i) => (
							<div key={`${i}-${badges[0].id}`}>
								<MediaRenderer
									client={client}
									src={badges[0].metadata.image}
									style={{ width: 30, height: 30 }}
								/>
							</div>
						))}
					</div>
				</div>
			)}
			<div className="gap-2 mt-12 w-full flex flex-wrap items-center justify-center">
				{cats.length > 0 ? (
					cats?.map((cat, i) => (
						<Cat key={`${i}-${cat.id.toString()}`} cat={cat} />
					))
				) : (
					<div>
						<p className="my-4 text-gray-500">
							<span className="text-white">
								All your cats have been destroyed!
							</span>
							<br />
							<span className="tracking-wide">
								Claim a new kitten to keep playing
							</span>
						</p>
						<p className="text-gray-500" />
						<ClaimKittenButton />
					</div>
				)}
			</div>
		</div>
	);
};

export default Cats;
