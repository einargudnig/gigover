import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { IProperty } from '../../models/Property';
import { ApiService } from '../../services/ApiService';

export interface PropertyResponse {
	property: IProperty;
}

export const useGetPropertyById = (propertyId: number) => {
	const { data, isPending, isError, error, isFetching } = useQuery<
		PropertyResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.getPropertyById(propertyId)],
		queryFn: async () => {
			const response = await axios.get(ApiService.getPropertyById(propertyId), {
				withCredentials: true
			});
			return response.data;
		},
		refetchOnWindowFocus: true,
		enabled: !!propertyId
	});

	return {
		data,
		isPending,
		isError,
		error,
		isFetching
	};
};
