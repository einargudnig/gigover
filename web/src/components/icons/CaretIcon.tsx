import React from 'react';
import { IconProps } from '../IconProps';
import { Theme } from '../../Theme';

export const CaretIcon = ({ scale = 1, color = Theme.colors.black }: IconProps): JSX.Element => (
	<svg
		width={15 * scale}
		height={10 * scale}
		viewBox="0 0 15 10"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M14 1L7.4375 7.5625L0.874999 0.999999" stroke={color} strokeWidth="2.38636" />
	</svg>
);
