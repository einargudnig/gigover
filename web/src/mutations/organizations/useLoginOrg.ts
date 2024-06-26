import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';
import { useMutation } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';

export const useLoginOrg = () => {
	const mutationKey = ApiService.loginOrganization;

	return useMutation<ErrorResponse, AxiosError, { name: string; password: string }>(
		mutationKey,
		async (variables) => {
			try {
				const response = await axios.post<ErrorResponse>(mutationKey, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorCode);
				}

				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	);
};
