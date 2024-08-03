import { Theme } from '../../Theme';
import { IconProps } from '../IconProps';

export const DragDropIcon = ({ color = Theme.colors.black }: IconProps) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 100 100">
			<circle cx="30" cy="20" r="10" fill={color} />
			<circle cx="30" cy="50" r="10" fill={color} />
			<circle cx="30" cy="80" r="10" fill={color} />

			<circle cx="70" cy="20" r="10" fill={color} />
			<circle cx="70" cy="50" r="10" fill={color} />
			<circle cx="70" cy="80" r="10" fill={color} />
		</svg>
	);
};
