type LevelNameProps = {
	level: 1n | 2n | 3n;
};

const LevelName: React.FC<LevelNameProps> = ({ level }) => {
	switch (level) {
		case 1n:
			return <span>🐱 Small Kitten</span>;
		case 2n:
			return <span>😾 Grumpy Cat</span>;
		case 3n:
			return <span>🥷 Ninja Cat</span>;
	}
};

export default LevelName;
