import axios from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';

interface PublishTenderResponse {
	errorText: 'OK';
}

interface PublishTenderRequest {
	tenderId: number;
}

export const usePublishTender = () => {
	const client = useQueryClient();

	return useMutation<PublishTenderResponse, ErrorResponse, PublishTenderRequest>(
		async (tenderId) => {
			try {
				const response = await axios.post(ApiService.publishTender, tenderId, {
					withCredentials: true
				});

				if (response.status === 200) {
					await client.refetchQueries(ApiService.getTenderById(tenderId.tenderId));
					await client.refetchQueries(ApiService.userTenders);
				}
				return response.data;
			} catch (e) {
				throw new Error('Could not publish tender');
			}
		}
	);
};
