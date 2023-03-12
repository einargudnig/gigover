import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import { Offer } from '../models/Tender';

export interface UserOfferResponse {
	list: Offer[];
}

export const useGetUserOffers = () => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		UserOfferResponse,
		ErrorResponse
	>(ApiService.userOffers, {
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
