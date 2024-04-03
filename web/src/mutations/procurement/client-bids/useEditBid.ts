import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../../../services/ApiService';
import { devError } from '../../../utils/ConsoleUtils';
import { Bid } from '../../../models/Tender';
import { ErrorResponse } from '../../../models/ErrorResponse';

export const useAddClientBid = () => {
	const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, Bid>(async (variables) => {
		try {
			const response = await axios.post(ApiService.editBid, variables, {
				withCredentials: true
			});

			if (response.data.errorCode === 'DATA_STORE_EXCEPTION') {
				throw new Error(response.data?.errorCode);
			}
			// TODO Fix this to fetch clientBidById
			// await client.refetchQueries(ApiService.getBidById(bidId));

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not add client bid');
		}
	});
};
