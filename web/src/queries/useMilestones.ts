import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { MilestoneForm } from '../models/Milestone';
import { ApiService } from '../services/ApiService';

export interface MilestoneResponse {
	milestones: MilestoneForm[];
}

export const useMilestones = (projectId: number) =>
	useQuery<MilestoneResponse, ErrorResponse>({
		queryKey: [ApiService.getMilestones(projectId)],
		enabled: !!projectId,
		refetchOnWindowFocus: true
	});
