import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { TenderItem } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

interface TenderItemDeleteResponse {
	errorText: 'OK';
}

export const useDeleteTenderItem = () => {
	const { tenderId } = useParams();
	const queryClient = useQueryClient();

	return useMutation<TenderItemDeleteResponse, AxiosError, TenderItem>({
		mutationFn: async (tender) => {
			try {
				const response = await axios.post(ApiService.deleteTenderItem, tender, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				if (e instanceof Error) {
					throw e;
				}
				throw new Error('Could not delete tender item');
			}
		},
		onSuccess: async (data, variables) => {
			await queryClient.refetchQueries({
				queryKey: [ApiService.getTenderById(Number(tenderId))]
			});
		}
	});
};
