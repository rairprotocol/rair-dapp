import Image from "next/image";

const Footer = () => {
	return (
		<>
			<div className="flex flex-col space-y-2 w-full max-w-xs justify-center">
				<a
					href="https://thirdweb.com/joenrv.eth/CatAttackNFT"
					target="_blank"
					className="p-3 text-xs font-semibold border border-white/20 rounded flex items-center justify-center space-x-1 hover:bg-white/10 transition"
					rel="noreferrer"
				>
					<Image src="/icons/rocket.svg" width={12} height={12} alt="Zap" />
					<span>Deploy your own CatAttack contract</span>
				</a>
				<a
					href="https://github.com/joaquim-verges/catattacknft"
					target="_blank"
					className="p-3 text-xs font-semibold border border-white/20 rounded flex items-center justify-center space-x-1 hover:bg-white/10 transition"
					rel="noreferrer"
				>
					<Image src="/icons/github.svg" width={12} height={12} alt="Zap" />
					<span>Check out the code on github</span>
				</a>
			</div>
			<h4 className="font-semibold mt-12 mb-2">
				Created by 🐱{" "}
				<a
					href="https://twitter.com/thirdweb"
					target="_blank"
					className="underline hover:no-underline"
					rel="noreferrer"
				>
					thirdweb
				</a>{" "}
				with ❤️
			</h4>
			<p className="font-semibold text-gray-500">
				No animals were hurt building this game.
			</p>
		</>
	);
};

export default Footer;
