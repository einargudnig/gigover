import React, { Dispatch, SetStateAction } from 'react';
import { Project, WorkerItem } from '../models/Project';
import { Task } from '../models/Task';
import { Milestone } from '../models/Milestone';

export interface ITimeTrackerModalContext {
	project?: Project;
	task?: Task;
	worker?: WorkerItem;
	callback?: () => void;
}

export interface IEditTimeTrackerModalContext {
	projectName: string;
	taskName: string;
	workerName: string;
	workId: number;
	hours: number;
	minutes: number;
	callback: () => void;
}

export interface MilestoneModalContext {
	projectId: number;
	milestone?: Milestone;
	callback: () => void;
}

export interface IEditPhotoContext {
	photoId: number;
	projectId: number;
}

export interface IModalContext {
	modifyProject?: {
		project?: Project;
	};
	timeTracker?: ITimeTrackerModalContext;
	editTimeTracker?: IEditTimeTrackerModalContext;
	milestone?: MilestoneModalContext;
	registered?: boolean;
	taskDetails?: {
		task: Task;
		projectId: number;
	};
	editPhoto?: IEditPhotoContext;
}

export type ModalContextProvider = [IModalContext, Dispatch<SetStateAction<IModalContext>>];

export const ModalContext = React.createContext<ModalContextProvider>([
	{
		registered: false
	},
	() => null
]);
