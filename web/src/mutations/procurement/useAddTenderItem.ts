import { useMutation } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { AxiosError } from 'axios';
import axios from 'axios';
import { useQueryClient } from 'react-query';

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

	return useMutation<ErrorResponse, AxiosError, TenderItems>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addTenderItem, variables, {
				withCredentials: true
			});
			// If I successfully added a tender item, I need to refetch the tenderItems
			// So that the new tender item is displayed in the list.
			// I need to refetch the getTenderById query, since that is the one that fetches the tenderItems
			const tenderId = variables?.tenderId || 0;
			if (response.status === 200) {
				await queryClient.refetchQueries(ApiService.getTenderById(tenderId));
			}

			return response.data;
		} catch (e) {
			throw new Error('Could not add tender item');
		}
	});
};
