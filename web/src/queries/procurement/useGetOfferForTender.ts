import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { Offer } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface OfferForTenderResponse {
	list: Offer[];
}

export const useGetOfferForTender = (tenderId: number) => {
	const { data, isPending, isSuccess, isError, error } = useQuery<
		OfferForTenderResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.tenderOffers(tenderId)],
		queryFn: async () => {
			const response = await axios.get(ApiService.tenderOffers(tenderId), {
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
