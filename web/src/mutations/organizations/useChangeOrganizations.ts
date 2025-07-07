import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface ChangeOrganizationVariables {
	id: number;
}

export const useChangeOrganizations = () => {
	const queryClient = useQueryClient();
	const mutationKey = ApiService.changeOrganizations;

	return useMutation<ErrorResponse, Error, ChangeOrganizationVariables>({
		mutationKey: [mutationKey],

		mutationFn: async (variables: ChangeOrganizationVariables) => {
			try {
				const response = await axios.post<ErrorResponse>(mutationKey, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorCode);
				}

				await queryClient.invalidateQueries({ queryKey: [ApiService.changeOrganizations] });
				await queryClient.invalidateQueries({ queryKey: [ApiService.getUserInfo] });
				await queryClient.invalidateQueries({ queryKey: [ApiService.getProperties] });
				await queryClient.invalidateQueries({ queryKey: [ApiService.projectList] });

				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	});
};
