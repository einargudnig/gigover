import { useMutation } from 'react-query';
import { ErrorResponse, ErrorTypes } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Firebase } from '../firebase/firebase';
import { useContext } from 'react';
import { FirebaseContext } from '../firebase/FirebaseContext';

export interface RegistrationData {
	name: string;
	address: string;
	zipCode: string;
	email: string;
	type: 1;
	userName: string;
	phoneNumber: string;
}

export const useRegister = () => {
	const firebase: Firebase = useContext(FirebaseContext);

	return useMutation<{ data: ErrorResponse }, ErrorResponse, RegistrationData>(
		async (variables) =>
			await axios.post(ApiService.registerUser, variables, {
				withCredentials: true
			}),
		{
			onSuccess: async (res) => {
				// Refresh Firebase Credentials
				if (res.data.errorCode === ErrorTypes.OK) {
					const cloneCurrentUser = Object.assign(firebase.auth.currentUser, {});

					await firebase.auth.signOut();
					await firebase.auth.updateCurrentUser(cloneCurrentUser);
				} else {
					throw new Error(
						'Could not register user, Code: ' +
							res.data.errorCode +
							' Message: ' +
							res.data.errorText
					);
				}
			}
		}
	);
};
