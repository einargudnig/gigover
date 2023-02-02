export interface TenderItem {
	tenderItemId: number;
	// tenderId?: number; //? Not sure about this one, I think it should be nice. But we'll see.
	number: number;
	description: string;
	volume: number;
	unit: string;
	price: number;
}
