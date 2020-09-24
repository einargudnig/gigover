import { useMutation } from 'react-query';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { IUserProfile } from '../models/UserProfile';
import { ErrorResponse } from '../models/ErrorResponse';

export const useVerify = () =>
	useMutation<IUserProfile, ErrorResponse, { token: string }>((variables) =>
		axios.post(ApiService.verify, variables, {
			withCredentials: true
		})
	);
