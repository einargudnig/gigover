import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { IProperties } from '../../models/Property';
import { ApiService } from '../../services/ApiService';

export interface PropertiesResponse {
	properties: IProperties[];
}

export const useGetProperties = () => {
	const { data, isPending, isFetching, isError, error } = useQuery<
		PropertiesResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.getProperties],
		queryFn: async () => {
			const response = await axios.get(ApiService.getProperties, { withCredentials: true });
			return response.data;
		}
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
