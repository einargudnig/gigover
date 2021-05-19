import { ColorKey } from '../styles/theme';
import { Asset } from './Asset';

export enum PageBlockType {
	Hero = 'Hero',
	Video = 'Video',
	Features = 'Features',
}

export type Feature = {
	title: string;
	description: string;
	icon: 'report' | 'timer' | 'message' | 'tasks';
};

export interface PageBlock {
	id: string;
	heading: string | null;
	content: string | null;
	image: Asset | null;
	pageBlockColor: ColorKey;
	blockType: PageBlockType;
	features: Feature[];
}
