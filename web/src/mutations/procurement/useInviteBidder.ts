import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../../services/ApiService';
import axios, { AxiosError } from 'axios';
import { devError } from '../../utils/ConsoleUtils';
import { ErrorResponse } from '../../models/ErrorResponse';

interface InviteBidderInput {
	tenderId: number;
	uId: string;
}

export const useInviteBidder = () => {
	const queryClient = useQueryClient();
	const mutationKey = ApiService.addBidder;

	return useMutation<ErrorResponse, AxiosError, InviteBidderInput>(
		mutationKey,
		async (variables) => {
			try {
				console.log(variables);
				const response = await axios.post<ErrorResponse>(mutationKey, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorCode);
				}

				// we want to refetch this query so the bidder table updates after we invite a bidder.
				queryClient.refetchQueries(ApiService.getTenderById(variables.tenderId));
				console.log(response.data);
				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	);
};
