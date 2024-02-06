import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../../../services/ApiService';
import { devError } from '../../../utils/ConsoleUtils';
import { ClientBid } from '../../../models/Tender';}
import { ErrorResponse } from '../../../models/ErrorResponse';


export const useAddClientBid = () => {
	const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, ClientBid>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addClientBid, variables, {
				withCredentials: true
			});

			if (response.data.errorCode === 'DATA_STORE_EXCEPTION') {
				throw new Error(response.data?.errorCode);
			}
			await client.refetchQueries(ApiService.addClientBid);

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not add client bid');
		}
	});
};
