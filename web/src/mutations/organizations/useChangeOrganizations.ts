import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../../services/ApiService';
import axios, { AxiosError } from 'axios';
import { devError } from '../../utils/ConsoleUtils';
import { ErrorResponse } from '../../models/ErrorResponse';

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

				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	);
};
