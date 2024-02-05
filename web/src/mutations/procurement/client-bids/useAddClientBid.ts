import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../../../services/ApiService';
import { devError } from '../../../utils/ConsoleUtils';
import { ErrorResponse } from '../../../models/ErrorResponse';

export interface ClientBidFormData {
	projectId?: number;
	projectName?: string;
	taskId?: number;
	description: string;
	terms: string;
	finishDate: number;
	delivery: number;
	address: string;
	phoneNumber: string;
}

export const useAddClientBid = () => {
	const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, ClientBidFormData>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addClientBid, variables, {
				withCredentials: true
			});

			if (response.data.errorCode === 'DATA_STORE_EXCEPTION') {
				throw new Error(response.data?.errorCode);
			}
			await client.refetchQueries(ApiService.userClientBids);

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not add client bid');
		}
	});
};
