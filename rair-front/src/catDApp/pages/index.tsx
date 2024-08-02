import type { NextPage } from "next";
import { useState } from "react";
import Header from "../components/header";
import Events from "../components/events";
import Welcome from "../components/welcome";
import ClaimKitten from "../components/claim-kitten";
import { contract } from "../utils/constants";
import { GameContext } from "../contexts/game-context";
import Cats from "../components/cats";
import Footer from "../components/footer";
import { EventContext } from "../contexts/event-context";
import { Spinner } from "../components/Spinner/Spinner";
import { useContractEvents, useReadContract } from "thirdweb/react";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
	useActiveAccount,
	useActiveWalletConnectionStatus,
} from "thirdweb/react";
import {
	getScore,
	levelUpEvent,
	miaowedEvent,
} from "../thirdweb/84532/0x5ca3b8e5b82d826af6e8e9ba9e4e8f95cbc177f4";

export const HomeCat: NextPage = () => {
	// contract data
	const address = useActiveAccount()?.address;
	const connectionStatus = useActiveWalletConnectionStatus();

	const {
		data: nfts,
		refetch,
		isLoading: nftsLoading,
	} = useReadContract(getOwnedNFTs, {
		contract,
		address: address || "",
		queryOptions: {
			enabled: !!address,
		},
	});

	const { data: playerScore } = useReadContract(getScore, {
		contract,
		player: address || "",
	});

	const eventsQuery = useContractEvents({
		contract,
		events: [levelUpEvent(), miaowedEvent()],
		blockRange: 50000,
	});
	const events = (eventsQuery.data || []).toReversed().slice(0, 15);

	// state
	const [targetAddress, setTargetAddress] = useState<string>("");

	// context
	const gameContext = {
		refetch,
		targetAddress,
		setTargetAddress,
		nfts: nfts || [],
		playerScore: playerScore || 0n,
	};

	return (
		<GameContext.Provider value={gameContext}>
			<EventContext.Provider
				value={{
					events: events || [],
					isLoading: eventsQuery.isLoading,
				}}
			>
				<Header />
				<div className="max-w-3xl flex flex-col items-center mx-auto py-8 px-4">
					{connectionStatus === "disconnected" && <Welcome />}
					{connectionStatus === "connecting" && <Loading />}
					{connectionStatus === "connected" && (
						<>
							{nftsLoading ? (
								<Loading />
							) : (
								<> {nfts?.length ? <Cats /> : <ClaimKitten />}</>
							)}
						</>
					)}
					<Events />
					<Footer />
				</div>
			</EventContext.Provider>
		</GameContext.Provider>
	);
};


const Loading = () => {
	return (
		<div
			className="flex justify-center items-center"
			style={{
				height: "700px",
			}}
		>
			<Spinner size="50px" />
		</div>
	);
};
