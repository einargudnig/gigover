import React, { Dispatch, SetStateAction } from 'react';
import { Project, WorkerItem } from '../models/Project';
import { Task } from '../models/Task';
import { Milestone } from '../models/Milestone';
import { Resource } from '../models/Resource';
import { ProjectFolder } from '../models/ProjectFolder';
import { ProjectImage } from '../models/ProjectImage';
import { TimeTrackerReportResultItem } from '../pages/TimeTracker/useTimeTrackerReport';
import { Tender } from '../models/Tender';
import { Bid } from '../models/Tender';
import { IPropertyForm, IPropertyUnit, IStakeholder } from '../models/Property';

export interface ITimeTrackerModalContext {
	project?: Project;
	task?: Task;
	worker?: WorkerItem;
	callback?: () => void;
}

export interface IEditTimeTrackerModalContext {
	reportItem: TimeTrackerReportResultItem;
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

export interface IResourceModalContext {
	resource?: Resource;
}

export interface ShareItemContext {
	project?: Project;
	folder?: ProjectFolder;
	file?: ProjectImage;
}

export interface ResourceTrackerContext {
	project: Project;
	resource?: Resource;
	task?: Task;
}

export interface IModalContext {
	modifyProject?: {
		project?: Project;
	};
	timeTracker?: ITimeTrackerModalContext;
	editTimeTracker?: IEditTimeTrackerModalContext;
	milestone?: MilestoneModalContext;
	shareItem?: ShareItemContext;
	registered?: boolean;
	taskDetails?: {
		task: Task;
		projectId: number;
	};
	editPhoto?: IEditPhotoContext;
	resources?: IResourceModalContext;
	resourceTracker?: ResourceTrackerContext;
	modifyTender?: {
		modifyTender?: Tender;
	};
	addTender?: {
		tender?: Tender;
	};
	addBid?: {
		bid?: Bid;
	};
	addProperty?: {
		property?: IPropertyForm;
	};
	editProperty?: {
		property?: IPropertyForm;
	};
	addUnit?: {
		unit?: IPropertyUnit;
		propertyId: number;
	};
	editUnit?: {
		unit?: IPropertyUnit;
		propertyId: number;
	};
	stakeholder?: {
		stakeholder?: IStakeholder;
		propertyId: number;
	};
}

export type ModalContextProvider = [IModalContext, Dispatch<SetStateAction<IModalContext>>];

export const ModalContext = React.createContext<ModalContextProvider>([
	{
		registered: false
	},
	() => null
]);
