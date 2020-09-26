export interface IconProps {
	size?: number;
	scale?: number;
	color?: string;

	onClick?(event: unknown): void;
}
