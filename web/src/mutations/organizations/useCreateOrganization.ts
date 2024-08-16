import axios, { AxiosError, AxiosResponse } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export const useCreateOrganization = () => {
	const queryClient = useQueryClient();
	/* eslint-disable @typescript-eslint/no-explicit-any */
	return useMutation<
		AxiosResponse<{ errorCode: string; errorString: string }>,
		AxiosError,
		{ name: string; password: string }
	>(async (organization) => {
		try {
			const response = await axios.post(ApiService.createOrganization, organization, {
				withCredentials: true
			});

			queryClient.refetchQueries(ApiService.getOrganizations);
			return response;
		} catch (e) {
			devError(e);
			throw new Error('Could not create organization');
		}
	});
};
