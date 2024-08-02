import Image from "next/image";
import ClaimKittenButton from "./claim-kitten-button";

const ClaimKitten: React.FC = () => {
	return (
		<div className="flex flex-col items-center w-full space-y-12">
			<h1 className="font-bold sm:text-6xl text-4xl leading-none text-center tracking-tight">
				<span
					className="!bg-clip-text text-transparent"
					style={{
						background:
							"linear-gradient(73.59deg, #C339AC 42.64%, #CD4CB5 54%, #E173C7 77.46%)",
					}}
				>
					Claim your kitten
				</span>{" "}
				to get started
			</h1>
			<div className="mx-auto">
				<Image
					src="/cat-attack.png"
					width={400}
					height={320}
					alt="Cat Attack"
				/>
			</div>
			<ClaimKittenButton />
		</div>
	);
};

export default ClaimKitten;
