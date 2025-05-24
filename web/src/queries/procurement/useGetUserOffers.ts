import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { Offer } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface UserOfferResponse {
	list: Offer[];
}

export const useGetUserOffers = () => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		UserOfferResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.userOffers],
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
