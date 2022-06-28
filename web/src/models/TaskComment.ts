export interface TaskComment {
	projectId: number;
	taskId: number;
	comment: string;
	fullName: string;
	imageId: number;
	sent: number; /// Timestamp
}
