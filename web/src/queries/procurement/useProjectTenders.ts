import { useQuery } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';

export const useProjectTenders = (projectId: number) => {
	const { data, isLoading, isError, error } = useQuery<ErrorResponse>(
		ApiService.projectTenders(projectId)
	);

	return {
		data,
		isLoading,
		isError,
		error
	};
};
