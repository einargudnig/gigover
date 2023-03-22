import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { Tender } from '../models/Tender';

interface PublishTenderResponse {
	errorText: 'OK';
}

export const usePublishTender = () => {
	const client = useQueryClient();

	return useMutation<PublishTenderResponse, ErrorResponse, Tender>(
		async (tender) =>
			await axios.post(ApiService.publishTender, tender, { withCredentials: true }),
		{
			onSuccess: async () => {
				await client.refetchQueries(ApiService.userTenders);
			}
		}
	);
};
