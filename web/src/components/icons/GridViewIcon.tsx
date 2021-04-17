import React from 'react';
import { IconProps } from '../IconProps';
import { Theme } from '../../Theme';

export const GridViewIcon = ({ size = 24, color = Theme.colors.black }: IconProps): JSX.Element => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="3" y="3" width="8" height="8" rx="3" fill={color} />
		<rect x="3" y="13" width="8" height="8" rx="3" fill={color} />
		<rect x="13" y="3" width="8" height="8" rx="3" fill={color} />
		<rect x="13" y="13" width="8" height="8" rx="3" fill={color} />
	</svg>
);
