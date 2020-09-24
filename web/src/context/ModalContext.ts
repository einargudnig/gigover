import React, { Dispatch, SetStateAction } from 'react';

export interface IModalContext {
	project?: { id: number };
	timeTracker?: { projectId: number; taskId?: number };
	registered?: boolean;
}

export type ModalContextProvider = [IModalContext, Dispatch<SetStateAction<IModalContext>>];

export const ModalContext = React.createContext<ModalContextProvider>([
	{
		registered: false
	},
	() => null
]);
