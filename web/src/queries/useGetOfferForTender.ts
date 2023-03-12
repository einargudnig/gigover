import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Offer } from '../models/Tender';
import { ErrorResponse } from '../models/ErrorResponse';

export interface OfferForTenderResponse {
	list: Offer[];
}

export const useGetOfferForTender = (tenderId: number) => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		OfferForTenderResponse,
		ErrorResponse
	>(ApiService.tenderOffers(tenderId), {
		refetchOnWindowFocus: true
		// withCredentials: true
	});
	const offers: Offer[] = data?.list || [];

	return {
		data: offers,
		isLoading,
		isError,
		isSuccess,
		error
	};
};
