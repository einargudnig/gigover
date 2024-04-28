export const LoadingSpinner = (): JSX.Element => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			viewBox="0 0 16 16"
			preserveAspectRatio="xMidYMid"
		>
			<circle
				cx="8"
				cy="8"
				fill="none"
				stroke="black"
				strokeWidth="2"
				r="5"
				strokeDasharray="23.561944901923447 9.853981633974483"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					repeatCount="indefinite"
					dur="1.4925373134328357s"
					values="0 8 8;360 8 8"
					keyTimes="0;1"
				/>
			</circle>
		</svg>
	);
};
