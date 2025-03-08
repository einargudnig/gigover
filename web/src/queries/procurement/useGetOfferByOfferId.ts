import { useQuery } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { GetOffer } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface OfferResponse {
	offer: GetOffer;
}

export const useGetOfferByOfferId = (offerId: number) => {
	const { data, isLoading, isError, error, isFetching } = useQuery<OfferResponse, ErrorResponse>(
		ApiService.offer(offerId),
		{
			refetchOnWindowFocus: true
		}
	);

	return {
		data,
		isLoading,
		isError,
		error,
		isFetching
	};
};
