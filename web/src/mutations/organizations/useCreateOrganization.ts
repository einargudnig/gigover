import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';

export const useCreateOrganization = () => {
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
			return response;
		} catch (e) {
			devError(e);
			throw new Error('Could not create organization');
		}
	});
};
