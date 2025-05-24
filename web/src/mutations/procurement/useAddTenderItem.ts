import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';

export interface TenderItems {
	tenderId: number;
	tenderItemId?: number;
	nr?: number;
	description?: string;
	volume?: number;
	unit?: string;
}

export const useAddTenderItem = () => {
	const queryClient = useQueryClient();

	return useMutation<unknown, AxiosError, TenderItems>({
		mutationFn: async (variables) => {
			try {
				const response = await axios.post(ApiService.addTenderItem, variables, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				if (e instanceof Error) {
					throw e;
				}
				throw new Error('Could not add tender item');
			}
		},
		onSuccess: async (data, variables) => {
			const tenderId = variables?.tenderId || 0;
			await queryClient.refetchQueries({ queryKey: [ApiService.getTenderById(tenderId)] });
		}
	});
};
