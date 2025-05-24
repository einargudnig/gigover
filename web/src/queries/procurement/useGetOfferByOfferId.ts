import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { GetOffer } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface OfferResponse {
	offer: GetOffer;
}

export const useGetOfferByOfferId = (offerId: number) => {
	const { data, isPending, isError, error, isFetching } = useQuery<OfferResponse, ErrorResponse>({
		queryKey: [ApiService.offer(offerId)],
		queryFn: async () => {
			const response = await axios.get(ApiService.offer(offerId), {
				withCredentials: true
			});
			return response.data;
		},
		refetchOnWindowFocus: false,
		enabled: !!offerId
	});

	return {
		data,
		isPending,
		isError,
		error,
		isFetching
	};
};
