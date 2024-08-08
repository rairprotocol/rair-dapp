import Image from "next/image";
import { Aurora } from "./Aurora";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import {
	accountAbstraction,
	appMetadata,
	CHAIN,
	client,
	contract,
	wallets,
} from "../utils/constants";
import type { Address } from "thirdweb";

const Header: React.FC = () => {
	const address = useActiveAccount()?.address;
	return (
		<header className="w-full p-4 mb-12">
			<Aurora
				size={{ width: "1800px", height: "700px" }}
				pos={{ top: "0%", left: "50%" }}
				color="hsl(277deg 59% 39% / 20%)"
			/>
			<div className="max-w-5xl mx-auto flex justify-between items-center ">
				{/* <div>
					<Image
						className="md:hidden"
						width={48}
						height={48}
						src="/thirdweb.svg"
						alt="thirdweb"
					/>
					<Image
						className="hidden md:block"
						width={194}
						height={28}
						src="/logo.png"
						alt="thirdweb"
					/>
				</div> */}

				<div className="max-w-xs">
					{address ? (
						<ConnectButton
							client={client}
							appMetadata={appMetadata}
							wallets={wallets}
							accountAbstraction={accountAbstraction}
							supportedNFTs={{
								[CHAIN.id]: [contract.address as Address],
							}}
						/>
					) : null}
				</div>
			</div>
		</header>
	);
};

export default Header;
