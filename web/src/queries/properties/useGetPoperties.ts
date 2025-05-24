import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { IProperties } from '../../models/Property';
import { ApiService } from '../../services/ApiService';

export interface PropertiesResponse {
	properties: IProperties[];
}

export const useGetProperties = () => {
	const { data, isLoading, isFetching, isError, error } = useQuery<
		PropertiesResponse,
		ErrorResponse
	>({ queryKey: [ApiService.getProperties] });

	const properties: IProperties[] = data?.properties || [];

	return {
		data: properties,
		isLoading,
		isFetching,
		isError,
		error
	};
};
