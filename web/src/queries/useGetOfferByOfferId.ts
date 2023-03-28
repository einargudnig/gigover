import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Offer } from '../models/Tender';
import { ErrorResponse } from '../models/ErrorResponse';

export interface OfferResponse {
	list: Offer;
}

export const useGetOfferByOfferId = (offerId: number) => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<OfferResponse, ErrorResponse>(
		ApiService.offer(offerId),
		{
			refetchOnWindowFocus: true
		}
	);

	return {
		data,
		isLoading,
		isError,
		isSuccess,
		error
	};
};
