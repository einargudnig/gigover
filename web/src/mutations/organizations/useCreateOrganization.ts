import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface CreateOrganizationInput {
	name: string;
	password: string;
}

export const useCreateOrganization = () => {
	const queryClient = useQueryClient();
	return useMutation<AxiosResponse, AxiosError, CreateOrganizationInput>({
		mutationKey: [ApiService.createOrganization],
		mutationFn: async (organization: CreateOrganizationInput) => {
			try {
				const response = await axios.post(ApiService.createOrganization, organization, {
					withCredentials: true
				});

				queryClient.invalidateQueries({ queryKey: [ApiService.getOrganizations] });
				return response;
			} catch (e) {
				devError(e);
				throw e; // Re-throw original error
			}
		}
	});
};
