import axios from 'axios';
import { ApiService } from '../../../services/ApiService';
import { useMutation } from 'react-query';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { Bid } from '../../../models/Tender';

interface DeleteBidResponse {
	errorText: 'OK';
}

export const useDeleteBid = () => {
	return useMutation<DeleteBidResponse, ErrorResponse, Bid>(async (bidId) => {
		try {
			const response = await axios.post(ApiService.deleteBid, bidId, {
				withCredentials: true
			});

			if (response.status === 200) {
				console.log({ bidId });
			}
			return response.data;
		} catch (e) {
			throw new Error('Could not publish tender');
		}
	});
};
