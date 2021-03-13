import { MilestoneForm } from '../models/Milestone';
import { useQuery } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

export interface MilestoneResponse {
	milestones: MilestoneForm[];
}

export const useMilestones = (projectId: number) =>
	useQuery<MilestoneResponse, ErrorResponse>(ApiService.getMilestones(projectId), {
		refetchOnWindowFocus: true
	});
