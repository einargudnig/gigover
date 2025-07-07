import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Tender } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

interface TenderDeleteResponse {
	errorText: 'OK';
}

export const useDeleteProcurement = () => {
	return useMutation<TenderDeleteResponse, AxiosError, Tender>({
		mutationKey: ['deleteProcurement'],
		mutationFn: async (tender) => {
			try {
				const response = await axios.post(ApiService.deleteTender, tender, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				if (e instanceof Error) {
					throw e;
				}
				throw new Error('Could not delete tender');
			}
		}
	});
};
