import { useQuery } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { IProperty } from '../../models/Property';
import { ErrorResponse } from '../../models/ErrorResponse';

export interface PropertyResponse {
	property: IProperty;
}

export const useGetPropertyById = (propertyId: number) => {
	const { data, isLoading, isError, error } = useQuery<PropertyResponse, ErrorResponse>(
		ApiService.getPropertyById(propertyId),
		{
			refetchOnWindowFocus: true
		}
	);

	return {
		data,
		isLoading,
		isError,
		error
	};
};
