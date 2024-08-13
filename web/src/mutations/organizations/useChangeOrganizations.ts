import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export const useChangeOrganizations = () => {
	const queryClient = useQueryClient();
	const mutationKey = ApiService.changeOrganizations;

	return useMutation<ErrorResponse, AxiosError, { id: number }>(
		mutationKey,
		async (variables) => {
			try {
				const response = await axios.post<ErrorResponse>(mutationKey, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorCode);
				}

				queryClient.refetchQueries(ApiService.changeOrganizations);
				queryClient.refetchQueries(ApiService.getUserInfo);

				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	);
};
