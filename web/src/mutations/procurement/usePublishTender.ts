import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';

interface PublishTenderResponse {
	errorText: 'OK';
}

interface PublishTenderRequest {
	tenderId: number;
}

export const usePublishTender = () => {
	const client = useQueryClient();

	return useMutation<PublishTenderResponse, ErrorResponse, PublishTenderRequest>({
		mutationFn: async (tenderIdRequest) => {
			try {
				const response = await axios.post(ApiService.publishTender, tenderIdRequest, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				if (e instanceof Error) {
					throw e;
				}
				throw new Error('Could not publish tender');
			}
		},
		onSuccess: async (data, tenderIdRequest) => {
			await client.refetchQueries({
				queryKey: [ApiService.getTenderById(tenderIdRequest.tenderId)]
			});
			await client.refetchQueries({ queryKey: [ApiService.userTenders] });
		}
	});
};
