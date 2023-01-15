import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Tender } from '../models/Tender';

// Types
export interface ProjectFormData
	extends Pick<
		Tender,
		'name' | 'description' | 'terms' | 'finishDate' | 'delivery' | 'address' | 'phoneNumber'
	> {}

export const useModifyTender = () => {
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, ProjectFormData>(async (variables) => {
		try {
			const response = await axios.post(ApiService.editTender, variables, {
				withCredentials: true
			});

			await queryClient.refetchQueries(ApiService.editTender);
			//Should I invalidate and refetch any queries here?

			return response.data;
		} catch (e) {
			throw new Error('Could not add tender');
		}
	});
};
