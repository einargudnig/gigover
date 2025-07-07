import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { Bid } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';
import { devError } from '../../../utils/ConsoleUtils';

export const useEditBid = () => {
	const client = useQueryClient();

	return useMutation<unknown, ErrorResponse, Bid>({
		mutationKey: ['editBid'],
		mutationFn: async (variables) => {
			try {
				const response = await axios.post(ApiService.editBid, variables, {
					withCredentials: true
				});

				if (
					response.data &&
					(response.data as { errorCode?: string }).errorCode === 'DATA_STORE_EXCEPTION'
				) {
					throw new Error((response.data as { errorCode?: string }).errorCode);
				}
				return response.data;
			} catch (e) {
				devError(e);
				if (e instanceof Error) {
					throw e;
				}
				throw new Error('Could not edit client bid');
			}
		},
		onSuccess: async (data, variables) => {
			await client.refetchQueries({ queryKey: [ApiService.getBidById(variables.bidId!)] });
		}
	});
};
