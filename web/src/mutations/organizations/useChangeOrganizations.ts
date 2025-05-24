import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export const useChangeOrganizations = () => {
	const queryClient = useQueryClient();
	const mutationKey = ApiService.changeOrganizations;

	return useMutation({
        mutationKey: mutationKey,

        mutationFn: async (variables) => {
			try {
				const response = await axios.post<ErrorResponse>(mutationKey, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorCode);
				}

				await queryClient.refetchQueries(ApiService.changeOrganizations);
				await queryClient.refetchQueries(ApiService.getUserInfo);
				await queryClient.refetchQueries(ApiService.getProperties);
				await queryClient.refetchQueries(ApiService.projectList);

				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
    });
};
