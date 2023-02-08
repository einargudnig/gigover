import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Tender } from '../models/Tender';
import { TenderResponse } from '../queries/useUserTenders';

// Types
export interface ProjectFormData
	extends Pick<
		Tender,
		'tenderId' | 'description' | 'terms' | 'finishDate' | 'delivery' | 'address' | 'phoneNumber'
	> {}

//! I know that I'm going through the try block, and returnin.
// I think I will have the same issues in Postman?
export const useModifyTender = () => {
	const queryClient = useQueryClient();

	return useMutation<TenderResponse, ErrorResponse, ProjectFormData>(async (variables) => {
		try {
			const response = await axios.post(ApiService.editTender, variables, {
				withCredentials: true
			});
			const tenderId = variables?.tenderId || 0;
			await queryClient.refetchQueries(ApiService.getTenderById(tenderId));
			// await queryClient.refetchQueries(ApiService.editTender);

			return response.data;
		} catch (e) {
			throw new Error('Could not add tender');
		}
	});
};
