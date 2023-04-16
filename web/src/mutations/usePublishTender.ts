import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
interface PublishTenderResponse {
	errorText: 'OK';
	tenderId: number;
}

interface PublishTenderRequest {
	tenderId: number;
}

export const usePublishTender = () => {
	const client = useQueryClient();

	return useMutation<PublishTenderResponse, ErrorResponse, PublishTenderRequest>(
		async (tenderId) =>
			await axios.post(ApiService.publishTender, tenderId, { withCredentials: true }),
		{
			onSuccess: async (data) => {
				const { tenderId } = data;
				await client.refetchQueries(ApiService.getTenderById(tenderId));
				await client.refetchQueries(ApiService.userTenders);
			}
		}
	);
};
