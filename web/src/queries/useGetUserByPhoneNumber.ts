import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';

interface UserIdByPhoneNumberResponse {
	data: {
		uId: string;
	};
}

interface UserIdByPhoneNumberVariables {
	phoneNumber: string;
}

export const useGetUserByPhoneNumber = () =>
	useMutation<UserIdByPhoneNumberResponse, string, UserIdByPhoneNumberVariables>({
		mutationFn: async ({ phoneNumber }) => {
			const response = await axios.post<UserIdByPhoneNumberResponse>(
				ApiService.getUserIdByPhoneNumber,
				{
					msisdn: phoneNumber
				},
				{
					withCredentials: false
				}
			);
			return response.data;
		}
	});
