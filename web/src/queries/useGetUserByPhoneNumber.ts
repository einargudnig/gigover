import { useMutation } from 'react-query';
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
	useMutation<UserIdByPhoneNumberResponse, string, UserIdByPhoneNumberVariables>(
		async ({ phoneNumber }) =>
			await axios.post<unknown, UserIdByPhoneNumberResponse>(
				ApiService.getUserIdByPhoneNumber,
				{
					msisdn: phoneNumber
				},
				{
					withCredentials: false
				}
			)
	);
