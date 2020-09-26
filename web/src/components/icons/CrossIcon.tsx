import React from 'react';
import { IconProps } from '../IconProps';

export const CrossIcon = ({ size = 42, color = '#000', ...props }: IconProps): JSX.Element => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 42 42"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<circle cx="21" cy="21" r="21" fill={color} />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M22.0013 21.1279L28.6675 14.4617L27.794 13.5883L21.1278 20.2545L14.4616 13.5883L13.5881 14.4617L20.2543 21.1279L13.5881 27.7941L14.4616 28.6676L21.1278 22.0014L27.794 28.6676L28.6675 27.7941L22.0013 21.1279Z"
			fill={color !== '#fff' ? 'white' : '#000'}
		/>
	</svg>
);
