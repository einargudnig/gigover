import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { ErrorResponse } from '../../models/ErrorResponse';
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

	return useMutation<ErrorResponse, AxiosError, ModifyTenderRequest>(async (variables) => {
		try {
			const response = await axios.post(ApiService.editTender, variables, {
				withCredentials: true
			});

			console.log(response);

			if (response.status === 200) {
				await queryClient.refetchQueries([ApiService.getTenderById(Number(tenderId))]);
				await queryClient.refetchQueries([ApiService.userTenders]);
			}
			return response.data;
		} catch (e) {
			throw new Error('Could not modify tender');
		}
	});
};
