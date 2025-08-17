import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { IProperties } from '../../models/Property';
import { ApiService } from '../../services/ApiService';

export interface PropertiesResponse {
	properties: IProperties[];
}

export const useGetProperties = () => {
	const { data, isPending, isFetching, isError, error } = useQuery<
		// const { data, isPending, isFetching, isError, error } = useSuspenseQuery<
		PropertiesResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.getProperties],
		queryFn: async () => {
			const response = await axios.get(ApiService.getProperties, {
				withCredentials: true
			});
			return response.data;
		},
		staleTime: 1000 * 60 * 5 // 5 minutes
	});

	const properties: IProperties[] = data?.properties || [];

	return {
		data: properties,
		isPending,
		isFetching,
		isError,
		error
	};
};
