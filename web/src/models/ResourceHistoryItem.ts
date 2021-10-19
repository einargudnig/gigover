export interface ResourceHistoryItem {
	id: number;
	uId: string;
	start: number; // timestamp
	stop: number | null; // timestamp
	startLat: number;
	startLng: number;
	stopLat: number;
	stopLng: number;
	projectId: number;
	taskId: number;
}
