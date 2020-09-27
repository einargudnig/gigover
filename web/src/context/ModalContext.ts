import React, { Dispatch, SetStateAction } from 'react';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

export interface ITimeTrackerModalContext {
	project?: Project;
	task?: Task;
	worker?: null; // TODO
}

export interface IModalContext {
	modifyProject?: {
		project?: Project;
	};
	timeTracker?: ITimeTrackerModalContext;
	registered?: boolean;
	task?: Task;
}

export type ModalContextProvider = [IModalContext, Dispatch<SetStateAction<IModalContext>>];

export const ModalContext = React.createContext<ModalContextProvider>([
	{
		registered: false
	},
	() => null
]);
