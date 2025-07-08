import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface InviteBidderInput {
	tenderId: number;
	uId: string;
}

export const useInviteBidder = () => {
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, AxiosError, InviteBidderInput>({
		mutationFn: async (variables) => {
			try {
				console.log(variables);
				const response = await axios.post<ErrorResponse>(ApiService.addBidder, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(
						response.data?.errorText || response.data?.errorCode || 'Invitation failed'
					);
				}
				console.log(response.data);
				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: [ApiService.getTenderById(variables.tenderId)]
			});
		}
	});
};
