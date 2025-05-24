import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface ChangePrivilegesProps {
	uId: string;
	priv: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export const useChangePrivileges = () => {
	const queryClient = useQueryClient();
	const mutationKey = ApiService.changeOrganizationUserPrivileges;

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

				await queryClient.refetchQueries(ApiService.getOrganizationUsers);

				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
    });
};
