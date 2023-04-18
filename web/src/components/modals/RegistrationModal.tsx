import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { useForm } from 'react-hook-form';
import { RegistrationData, useRegister } from '../../queries/useRegister';
import { UserContext } from '../../context/UserContext';
import { Input, InputWrapper } from '../forms/Input';
import { Label } from '../forms/Label';
import { ErrorTypes } from '../../models/ErrorResponse';
import { FirebaseContext } from '../../firebase/FirebaseContext';
import { devError } from '../../utils/ConsoleUtils';
import { Button } from '@chakra-ui/react';

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
	const { mutateAsync: registerFn, data, isLoading, isError, error } = useRegister();

	const finished = () => {
		setModalContext({ registered: true });
	};

	useEffect(() => {
		if (data?.data) {
			const resData = data.data;

			if (resData.errorCode === ErrorTypes.OK) {
				finished();
			} else if (resData.errorCode === ErrorTypes.NOT_LOGGED_IN) {
				firebase.signOut().then(() => {
					window.location.href = '/';
					alert('Invalid session, please log in again');
				});
			} else {
				setRegistrationError(
					'Could not register user. Reason code: ' +
						resData.errorCode +
						' Message: ' +
						resData.errorText
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>();
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
			devError('Error', e);
			setRegistrationError(e as string);
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
						{errors.name && <li>{errors.name.toString()}</li>}
						{errors.address && <li>{errors.address.toString()}</li>}
						{errors.zipCode && <li>{errors.zipCode.toString()}</li>}
						{errors.phoneNumber && <li>{errors.phoneNumber.toString()}</li>}
					</ul>
				</>
			)}
			<form onSubmit={onSubmit}>
				<InputWrapper>
					<Label>Name</Label>
					<Input name="name" required={true} {...register} />
				</InputWrapper>
				<InputWrapper>
					<Label>Phone number</Label>
					<Input name="phoneNumber" maxLength={7} required={true} {...register} />
				</InputWrapper>
				<InputWrapper>
					<Label>Address</Label>
					<Input name="address" required={true} {...register} />
				</InputWrapper>
				<InputWrapper>
					<Label>Zip code</Label>
					<Input name="zipCode" maxLength={3} required={true} {...register} />
				</InputWrapper>
				<Button
					disabled={isLoading}
					loading={isLoading}
					loadingText={'Submitting'}
					type="submit"
				>
					Submit
				</Button>
			</form>
		</div>
	);
};
