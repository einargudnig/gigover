import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { Tender } from '../../models/Tender';

interface TenderDeleteResponse {
	errorText: 'OK';
}

export const useDeleteProcurement = () => {
	return useMutation<TenderDeleteResponse, AxiosError, Tender>(async (tender) => {
		try {
			const response = await axios.post(ApiService.deleteTender, tender, {
				withCredentials: true
			});

			return response.data;
		} catch (e) {
			throw new Error('Could not delete tender');
		}
	});
};
