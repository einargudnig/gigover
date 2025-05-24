import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { IProperty } from '../../models/Property';
import { ApiService } from '../../services/ApiService';

export interface PropertyResponse {
	property: IProperty;
}

export const useGetPropertyById = (propertyId: number) => {
	const { data, isLoading, isError, error, isFetching } = useQuery<
		PropertyResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.getPropertyById(propertyId)],
		refetchOnWindowFocus: true,
		enabled: !!propertyId
	});

	return {
		data,
		isLoading,
		isError,
		error,
		isFetching
	};
};
