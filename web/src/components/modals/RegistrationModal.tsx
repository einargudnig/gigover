import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { useForm } from 'react-hook-form';
import { RegistrationData, useRegister } from '../../queries/useRegister';
import { UserContext } from '../../context/UserContext';
import { Input, InputWrapper } from '../forms/Input';
import { Label } from '../forms/Label';
import { ErrorTypes } from '../../models/ErrorResponse';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebase/FirebaseContext';

interface FormData extends Omit<RegistrationData, 'email' | 'type' | 'userName'> {
	name: string;
	address: string;
	zipCode: string;
	phoneNumber: string;
}

export const RegistrationModal = (): JSX.Element => {
	const user = useContext(UserContext);
	const firebase = useContext(FirebaseContext);
	const [, setModalContext] = useContext(ModalContext);
	const [registrationError, setRegistrationError] = useState('');
	const [registerFn, { data, isLoading, isError, error }] = useRegister();

	const finished = () => {
		setModalContext({ registered: true });
	};

	useEffect(() => {
		if (data?.data) {
			const resData = data.data;

			if (resData.errorCode === ErrorTypes.OK) {
				finished();
			} else if (resData.errorCode === ErrorTypes.NOT_LOGGED_IN) {
				alert('Invalid session, please log in again');
				firebase.signOut();
			} else {
				setRegistrationError(
					'Could not register user. Reason code: ' +
						resData.errorCode +
						' Message: ' +
						resData.errorText
				);
			}
		}
	}, [data]);

	const { register, handleSubmit, errors } = useForm<FormData>();
	const onSubmit = handleSubmit(async ({ name, address, zipCode, phoneNumber }) => {
		setRegistrationError('');
		try {
			await registerFn({
				name,
				address,
				zipCode,
				phoneNumber,
				email: user.email,
				userName: user.email,
				type: 1
			});
		} catch (e) {
			console.log('Error', e);
			setRegistrationError(e);
		}
	});

	return (
		<div>
			{isError && (
				<>
					{/* Server errors */}
					<p style={{ color: 'red' }}>{error?.errorText}</p>
					<small>{error?.errorCode}</small>
				</>
			)}
			{registrationError.length > 0 && (
				<>
					<p style={{ color: 'red' }}>{registrationError}</p>
				</>
			)}
			{errors && (
				<>
					<ul>
						{errors.name && <li>{errors.name}</li>}
						{errors.address && <li>{errors.address}</li>}
						{errors.zipCode && <li>{errors.zipCode}</li>}
						{errors.phoneNumber && <li>{errors.phoneNumber}</li>}
					</ul>
				</>
			)}
			<form onSubmit={onSubmit}>
				<InputWrapper>
					<Label>Name</Label>
					<Input name="name" required={true} ref={register} />
				</InputWrapper>
				<InputWrapper>
					<Label>Phone number</Label>
					<Input name="phoneNumber" maxLength={7} required={true} ref={register} />
				</InputWrapper>
				<InputWrapper>
					<Label>Address</Label>
					<Input name="address" required={true} ref={register} />
				</InputWrapper>
				<InputWrapper>
					<Label>Zip code</Label>
					<Input name="zipCode" maxLength={3} required={true} ref={register} />
				</InputWrapper>
				{isLoading ? (
					<button type="submit" disabled={true}>
						Loading
					</button>
				) : (
					<button type="submit">Submit</button>
				)}
			</form>
		</div>
	);
};
