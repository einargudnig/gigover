export interface TaskComment {
	projectId: number;
	taskId: number;
	comment: string;
	fullName: string;
	sent: number; /// Timestamp
}
