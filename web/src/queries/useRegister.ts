import { useMutation } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';

export interface RegistrationData {
	name: string;
	address: string;
	zipCode: string;
	email: string;
	type: number;
	userName: string;
	phoneNumber: string;
}

export const useRegister = () =>
	useMutation<unknown, ErrorResponse, RegistrationData>(
		async (variables) =>
			await axios.post(ApiService.registerUser, variables, {
				withCredentials: true
			})
	);
