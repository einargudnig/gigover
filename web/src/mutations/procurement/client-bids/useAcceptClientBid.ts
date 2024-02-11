import axios from 'axios';
import { ApiService } from '../../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { ClientBidId } from '../../../models/Tender';

export const useAcceptOffer = () => {
	const client = useQueryClient();

	return useMutation<ClientBidId, ErrorResponse, ClientBidId>(
		async (clientBidId) => {
			await axios.post(ApiService.acceptClientBid, clientBidId, { withCredentials: true });
			return clientBidId;
		},
		{
			onSuccess: async (variables) => {
				await client.refetchQueries(ApiService.getClientBidsById(variables.clientBidId));
			}
		}
	);
};
