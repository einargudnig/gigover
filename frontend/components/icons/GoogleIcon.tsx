import React, {CSSProperties} from 'react';

interface GoogleIconProps {
	size?: number;
	style?: CSSProperties;
}

export const GoogleIconProps = ({ size = 34, ...props }: GoogleIconProps): JSX.Element => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 34 34"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M21 12.496L24 9.5C22.225 7.893 19.765 7 17 7C12.994 7 9.684 9.242 8 12.5L11.312 15C12.142 12.596 14.292 11 17 11C18.923 11 20.26 11.82 21 12.496Z"
				fill="#EA4335"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M26.5 15H17V19H22.5C22.389 19.922 21.8 21.2 20.467 22.133L23.622 24.578C25.512 22.833 26.5 20.044 26.5 17V15Z"
				fill="#4285F4"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.978 17C10.978 16.311 11.1 15.644 11.3 15.022L8 12.5C7.322 13.856 7 15.389 7 17C7 18.611 7.389 20.133 8.067 21.489L11.311 18.978C11.0926 18.3413 10.9801 17.6731 10.978 17Z"
				fill="#FBBC05"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M23.622 24.578L20.467 22.133C19.622 22.723 18.489 23 17 23C14.356 23 12.111 21.389 11.311 18.978L8.078 21.488C9.722 24.757 13.088 27 17 27C19.7 27 21.967 26.111 23.622 24.578Z"
				fill="#34A853"
			/>
		</svg>
	);
};
