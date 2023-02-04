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
	items?: TenderItem[];
}

// This or items that we add to the tender
export interface TenderItem {
	tenderId: number;
	number: number;
	description: string;
	volume: number;
	unit: string;
	// price: number;
}

//{ "tender": {"tenderId": 4,"projectId": 977,"taskId": 2,"description": "testing2","terms": "flutt að dúfnahólum 11","finishDate": 1671880000,"delivery": 0,"phoneNumber": null,"address": null,"status": 1,"statusText": "statusText","items": [{"tenderItemId": 3,"tenderId": 0,"nr": 1,"description": "5x4 gipsplötur","volume": 35.5,"unit": "m2"}]}}
// To get the tender By Id, the 'definition' and the items
export interface GetTenderById {
	tender: Tender;
	// tenderItems: TenderItem[]; //! This one s not needed anymore, since the response has an items array on the tender object.
}
