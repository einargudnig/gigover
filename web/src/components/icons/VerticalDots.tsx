import React from 'react';
import { IconProps } from '../IconProps';
import { Theme } from '../../Theme';

export const VerticalDots = ({ color = Theme.colors.black }: IconProps) => {
	return (
		<svg
			height={24}
			viewBox="0 0 32 32"
			width={24}
			fill={color}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16 6a2 2 0 102 2c0-1.105-.895-2-2-2zm0 8a2 2 0 102 2c0-1.105-.895-2-2-2zm0 8a2 2 0 102 2c0-1.105-.895-2-2-2z"
				stroke={color}
			/>
		</svg>
	);
};
