import React, { useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { useForm } from 'react-hook-form';
import { RegistrationData, useRegister } from '../../queries/useRegister';
import { UserContext } from '../../context/UserContext';
import { Input, InputWrapper } from '../forms/Input';
import { Label } from '../forms/Label';

interface FormData extends Omit<RegistrationData, 'email' | 'type' | 'userName'> {
	name: string;
	address: string;
	zipCode: string;
	phoneNumber: string;
}

export const RegistrationModal = (): JSX.Element => {
	const user = useContext(UserContext);
	const [, setModalContext] = useContext(ModalContext);
	const [registerFn, { isLoading, isError, error }] = useRegister();

	const finished = () => {
		setModalContext({ registered: true });
	};

	const { register, handleSubmit, errors } = useForm<FormData>();
	const onSubmit = handleSubmit(async ({ name, address, zipCode, phoneNumber }) => {
		// TODO Validate form..
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

			finished();
		} catch (e) {
			console.log('Error', e);
		}
	});

	return (
		<div>
			{isError && (
				<>
					{/* Server errors */}
					<p>{error?.errorText}</p>
					<small>{error?.errorCode}</small>
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
