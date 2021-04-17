import React from 'react';
import { IconProps } from '../IconProps';
import { Theme } from '../../Theme';

export const DownloadIcon = ({ size = 24, color = Theme.colors.black }: IconProps): JSX.Element => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M13.0019 4.99959C13.0019 4.4473 12.5542 3.99959 12.0019 3.99959C11.4496 3.99959 11.0019 4.4473 11.0019 4.99959V13.0858L8.20897 10.2929C7.81845 9.90237 7.18528 9.90237 6.79475 10.2929C6.40423 10.6834 6.40423 11.3166 6.79475 11.7071L10.5877 15.5C11.3687 16.2811 12.6351 16.2811 13.4161 15.5L17.2071 11.7091C17.5976 11.3185 17.5976 10.6854 17.2071 10.2948C16.8166 9.90432 16.1834 9.90432 15.7929 10.2948L13.0019 13.0858V4.99959Z"
			fill={color}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M4 14C4.55228 14 5 14.4477 5 15V17C5 17.5523 5.44772 18 6 18H18C18.5523 18 19 17.5523 19 17V15C19 14.4477 19.4477 14 20 14C20.5523 14 21 14.4477 21 15V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V15C3 14.4477 3.44772 14 4 14Z"
			fill={color}
		/>
	</svg>
);
