import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';

export const useRemoveProperty = () => {
	const client = useQueryClient();

	return useMutation<void, ErrorResponse, number>({
		mutationKey: [ApiService.deleteProperty],
		mutationFn: async (propertyId: number) => {
			await axios.post(
				ApiService.deleteProperty,
				{
					id: propertyId
				},
				{
					withCredentials: true
				}
			);
		},
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: [ApiService.getProperties] });
		}
	});
};
