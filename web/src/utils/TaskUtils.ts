import { Task, TaskItem } from '../models/Task';

export const displayTaskTitle = (task?: Task | TaskItem) => {
	return task?.subject ?? task?.text ?? 'Unknown';
};

export const displayTaskType = (task?: Task | TaskItem) => {
	return task?.typeId ?? 'Unknown';
};
