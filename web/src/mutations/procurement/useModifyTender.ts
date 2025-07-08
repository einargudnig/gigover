import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { ApiService } from '../../services/ApiService';

// Types
export interface ModifyTenderRequest {
	tenderId: number;
	projectId: number;
	projectName: string;
	taskId: number;
	description: string;
	terms: string;
	finishDate: number;
	delivery: number;
	address: string;
	phoneNumber: string;
	email?: string; // Is this the tender creator email?
	status: number;
}

export const useModifyTender = () => {
	const { tenderId } = useParams();
	const queryClient = useQueryClient();

	return useMutation<unknown, AxiosError, ModifyTenderRequest>({
		mutationFn: async (variables) => {
			try {
				const response = await axios.post(ApiService.editTender, variables, {
					withCredentials: true
				});
				console.log(response);
				return response.data;
			} catch (e) {
				if (e instanceof Error) {
					throw e;
				}
				throw new Error('Could not modify tender'); // Fallback
			}
		},
		onSuccess: async (data, variables) => {
			// Assuming response.status === 200 check is implicitly handled by onSuccess
			await queryClient.invalidateQueries({
				queryKey: [ApiService.getTenderById(Number(tenderId))]
			});
			await queryClient.invalidateQueries({ queryKey: [ApiService.userTenders] });
		}
	});
};
