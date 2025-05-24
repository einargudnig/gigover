import axios from 'axios';
import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '../../../services/ApiService';
import { devError } from '../../../utils/ConsoleUtils';
import { ErrorResponse } from '../../../models/ErrorResponse';

export interface SingleTenderFormData {
	clientUId: string | null;
	description: string;
	terms: string;
	address: string;
	delivery: number;
	finishDate: number;
	notes?: string;
}

interface TenderCreateResponse {
	id: number;
	errorCode?: string;
}

export const useAddBid = (
	options?: UseMutationOptions<number, ErrorResponse, SingleTenderFormData>
) => {
	const client = useQueryClient();

	return useMutation({
        mutationFn: async (variables) => {
            try {
                const response = await axios.post<TenderCreateResponse>(ApiService.addBid, variables, {
                    withCredentials: true
                });

                if (response.data.errorCode === 'DATA_STORE_EXCEPTION') {
                    throw new Error(response.data?.errorCode);
                }
                await client.refetchQueries(ApiService.getBids);

                return response.data.id;
            } catch (e) {
                devError(e);
                throw new Error('Could not add client bid');
            }
        },

        ...options
    });
};
