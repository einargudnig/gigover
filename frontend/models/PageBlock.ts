import { ColorKey } from '../styles/theme';
import { Asset } from './Asset';

export enum PageBlockType {
	Hero = 'Hero'
}

export interface PageBlock {
	id: string;
	heading: string | null;
	content: string | null;
	image: Asset | null;
	pageBlockColor: ColorKey;
	blockType: PageBlockType;
}
