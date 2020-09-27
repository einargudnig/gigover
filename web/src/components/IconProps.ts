export interface IconProps {
	size?: number;
	scale?: number;
	color?: string;
	style?: React.CSSProperties;
	onClick?(event: unknown): void;
}
