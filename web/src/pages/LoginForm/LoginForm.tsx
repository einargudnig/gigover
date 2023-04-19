import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Center, Input } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

export interface LoginFormProps {
	closeForm: () => void;
	buttonText: string;
	loading: boolean;
	onSubmit: (email: string, password: string) => void;
}

export const LoginForm = ({
	closeForm,
	loading,
	buttonText,
	onSubmit
}: LoginFormProps): JSX.Element => {
	const { register, handleSubmit } = useForm<{ email: string; password: string }>({
		defaultValues: {
			email: '',
			password: ''
		}
	});

	return (
		<>
			<form
				onSubmit={handleSubmit(async (values) => {
					onSubmit(values.email, values.password);
				})}
			>
				<Input
					type={'email'}
					name={'email'}
					placeholder={'Your e-mail address'}
					{...register}
				/>
				<div style={{ height: 8 }} />
				<Input
					type={'password'}
					name={'password'}
					placeholder={'Enter your password'}
					{...register}
				/>
				<div style={{ height: 8 }} />
				<Button
					type={'submit'}
					width={'100%'}
					isLoading={loading}
					loadingText={'Submitting...'}
				>
					{buttonText}
				</Button>
				<div style={{ height: 16 }} />
				<Center onClick={() => closeForm()}>
					<ArrowBackIcon /> <span>Back to login options</span>
				</Center>
			</form>
		</>
	);
};
