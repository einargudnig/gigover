import React from 'react';
import { Theme } from '../../Theme';

export const SubmittedBidsIcon = ({ size = 24, color = Theme.colors.white }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
			<path
				d="M7 3l1.793 1.793L3 10.586 4.414 12l5.793-5.793L12 8V3H7zm10 0v1.2c-1 .3-2 1.2-2 2.8 0 1.9 1.6 2.5 2.6 2.9 1.2.5 1.4.6 1.4 1.1 0 .5-.2 1-1 1s-1-.5-1-1h-2c0 1 .6 2.4 2 2.8V15h2v-1.2c1.4-.4 2-1.8 2-2.8 0-1.9-1.6-2.5-2.6-2.9C17.2 7.6 17 7.5 17 7c0-.8.5-1 1-1 .8 0 1 .5 1 1h2c0-1-.6-2.4-2-2.8V3h-2zm-6 10v8h2v-8h-2zm-4 2v6h2v-6H7zm-4 2v4h2v-4H3zm12 0v4h2v-4h-2zm4 0v4h2v-4h-2z"
				fill={color}
			/>
		</svg>
	);
};
