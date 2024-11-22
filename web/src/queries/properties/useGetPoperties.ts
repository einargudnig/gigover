import { useQuery } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { IProperties } from '../../models/Property';
import { ErrorResponse } from '../../models/ErrorResponse';

export interface PropertiesResponse {
	properties: IProperties[];
}

export const useGetProperties = () => {
	const { data, isLoading, isFetching, isError, error } = useQuery<
		PropertiesResponse,
		ErrorResponse
	>(ApiService.getProperties, {
		refetchOnWindowFocus: true
		// withCredentials: true
	});

	const properties: IProperties[] = data?.properties || [];

	return {
		data: properties,
		isLoading,
		isFetching,
		isError,
		error
	};
};
