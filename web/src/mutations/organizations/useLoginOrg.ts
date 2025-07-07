import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface LoginOrgVariables {
	name: string | undefined;
	password: string;
}

export const useLoginOrg = () => {
	const mutationKey = ApiService.loginOrganization;

	return useMutation<ErrorResponse, Error, LoginOrgVariables>({
		mutationKey: [mutationKey],

		mutationFn: async (variables: LoginOrgVariables) => {
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
	});
};
