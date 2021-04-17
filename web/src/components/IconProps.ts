export interface IconProps {
	size?: number;
	scale?: number;
	color?: string;
	style?: React.CSSProperties;
	type?: 'solid' | 'bold' | 'medium' | 'light';
	onClick?(event: unknown): void;
}
