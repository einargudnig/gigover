import { ColorKey } from '../styles/theme';
import { Asset } from './Asset';

export enum PageBlockType {
	Hero = 'Hero',
	Video = 'Video',
	Features = 'Features',
	Reviews = 'Reviews',
	Testimonial = 'Testimonial',
	Image = 'Image',
}

export type Feature = {
	title: string;
	description: string;
	icon: 'report' | 'timer' | 'message' | 'tasks';
};

export type Testimonial = {
	testimonial: string;
	name: string;
	company: string;
	image: Asset | null;
};

export interface PageBlock {
	id: string;
	heading: string | null;
	content: string | null;
	image: Asset | null;
	pageBlockColor: ColorKey;
	blockType: PageBlockType;
	features: Feature[];
	testimonials: Testimonial[];
}
