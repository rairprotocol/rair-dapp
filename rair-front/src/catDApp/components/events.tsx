import Image from "next/image";
import { useContext } from "react";
import { EventContext } from "../contexts/event-context";
import { isOwnEvent } from "../utils/utils";
import { Address } from "./address";
import LevelName from "./level-name";
import { useActiveAccount } from "thirdweb/react";

export type EventProps = {
	type: "LevelUp" | "Miaowed";
	// biome-ignore lint/suspicious/noExplicitAny: TODO type this
	data: Record<string, any>;
};

export const Event: React.FC<EventProps> = ({ type, data }) => {
	const level = data.level as 1n | 2n | 3n;
	const { address } = useActiveAccount() || {};

	return (
		<div
			className={`border ${
				isOwnEvent({ type, data }, address)
					? "border-green-700"
					: "border-neutral-700"
			} rounded-lg flex items-center w-full leading-none`}
		>
			<div className="shrink-0 h-16">
				<Image
					className="rounded-l-lg"
					width={64}
					height={64}
					alt=""
					src={`/events/${type}${type === "LevelUp" ? `_${level}` : ""}.png`}
				/>
			</div>
			<div className="space-y-2 font-semibold overflow-hidden px-4">
				{type === "LevelUp" && (
					<>
						<p className="text-gray-500 truncate">
							<Address address={data.account} />
						</p>
						<p className="truncate">
							{level === 1n ? "claimed a" : "leveled up to"}{" "}
							<LevelName level={level} />
						</p>
					</>
				)}
				{type === "Miaowed" && (
					<>
						<p className="text-gray-500 truncate">
							<Address address={data.attacker} />
						</p>
						<p className="truncate">
							destroyed{" "}
							<span className="text-sm text-gray-500">
								<Address address={data.victim} />
							</span>{" "}
							<LevelName level={level} />
						</p>
					</>
				)}
			</div>
		</div>
	);
};

const EventSkeletons = [...Array(20).keys()].map((_, i) => (
	<EventSkeleton key={i} />
));

const Events: React.FC = () => {
	const { events, isLoading } = useContext(EventContext);

	return (
		<div className="my-20 flex flex-col items-center max-w-sm w-full">
			<h2
				className="font-bold text-3xl leading-none !bg-clip-text text-transparent"
				style={{
					background:
						"linear-gradient(73.59deg, #C339AC 42.64%, #CD4CB5 54%, #E173C7 77.46%)",
				}}
			>
				Game events
			</h2>

			<div className="space-y-3 mt-6 w-full">
				{isLoading ? (
					EventSkeletons
				) : events?.length > 0 ? (
					events?.map((e) => (
						<Event
							key={`${e.transactionHash}_${e.logIndex}`}
							type={e.eventName as EventProps["type"]}
							data={e.args}
						/>
					))
				) : (
					<p> No Events </p>
				)}
			</div>
		</div>
	);
};

export function EventSkeleton() {
	return (
		<div
			className="animate-pulse flex border border-neutral-600 justify-start rounded-lg w-full overflow-hidden gap-4"
			style={{
				height: "68px",
			}}
		>
			<div
				className="bg-neutral-500 dark:bg-neutral-600"
				style={{
					width: "64px",
				}}
			/>
			<div>
				<div className="h-2.5 bg-neutral-500 dark:bg-neutral-600 w-36 mt-3 rounded-lg" />
				<div className="h-2.5 bg-neutral-500 dark:bg-neutral-600 w-48 mt-4 rounded-lg" />
			</div>
		</div>
	);
}

export default Events;
