export interface ResourceHistoryItem {
	id: number;
	uId: string;
	userName: string;
	start: number; // timestamp
	stop: number | null; // timestamp
	startLat: number;
	startLng: number;
	stopLat: number;
	stopLng: number;
	projectId: number;
	projectName: string;
	taskId: number;
	taskName: string;
}
