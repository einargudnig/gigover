import { Project } from './Project';

export interface Tender {
	tenderId: number;
	projectId: number;
	taskId: number;
	description: string;
	terms: string;
	finishDate: number;
	delivery: number;
	address: string;
	phoneNumber: string;
	projectName?: Project[]; // I'm not sure if I should do this? I want to have the projectName on the tender object. This does work but it's kinda sloppy.
}
