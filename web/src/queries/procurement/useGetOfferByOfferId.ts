import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { GetOffer } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface OfferResponse {
	offer: GetOffer;
}

export const useGetOfferByOfferId = (offerId: number) => {
	const { data, isLoading, isError, error, isFetching } = useQuery<OfferResponse, ErrorResponse>({
		queryKey: [ApiService.offer(offerId)],
		refetchOnWindowFocus: false,
		enabled: !!offerId
	});

	return {
		data,
		isLoading,
		isError,
		error,
		isFetching
	};
};
