import React, { Dispatch, SetStateAction } from 'react';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

export interface IModalContext {
	modifyProject?: {
		project?: Project;
	};
	timeTracker?: { Project: Project; task?: Task };
	registered?: boolean;
}

export type ModalContextProvider = [IModalContext, Dispatch<SetStateAction<IModalContext>>];

export const ModalContext = React.createContext<ModalContextProvider>([
	{
		registered: false
	},
	() => null
]);
