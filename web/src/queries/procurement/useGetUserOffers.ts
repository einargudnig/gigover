import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { Offer } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface UserOfferResponse {
	list: Offer[];
}

export const useGetUserOffers = () => {
	const { data, isPending, isSuccess, isError, error } = useQuery<
		UserOfferResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.userOffers],
		queryFn: async () => {
			const response = await axios.get(ApiService.userOffers, {
				withCredentials: true
			});
			return response.data;
		},
		refetchOnWindowFocus: true
		// withCredentials: true
	});
	const offers: Offer[] = data?.list || [];

	return {
		data: offers,
		isPending,
		isError,
		isSuccess,
		error
	};
};
