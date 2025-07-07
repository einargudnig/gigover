import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ApiService } from '../../../services/ApiService';

export const useDeleteBid = () => {
	return useMutation({
		mutationFn: async (bidId: string | number) => {
			try {
				const response = await axios.post(
					ApiService.deleteBid,
					{ bidId },
					{
						withCredentials: true
					}
				);

				if (response.status === 200) {
					console.log({ bidId });
				}
				return response.data;
			} catch (e) {
				throw new Error('Could not publish tender');
			}
		}
	});
};
