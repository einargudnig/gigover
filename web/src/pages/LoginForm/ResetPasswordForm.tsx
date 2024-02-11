import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Center, Input } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

export interface ResetPasswordFormProps {
	closeForm: () => void;
	buttonText: string;
	loading: boolean;
	onSubmit: (email: string) => void;
}

export const ResetPasswordForm = ({
	closeForm,
	loading,
	buttonText,
	onSubmit
}: ResetPasswordFormProps): JSX.Element => {
	const { register, handleSubmit } = useForm<{ email: string }>({
		defaultValues: {
			email: ''
		}
	});

	return (
		<>
			<form
				onSubmit={handleSubmit(async (values) => {
					onSubmit(values.email);
				})}
			>
				<Input type={'email'} placeholder={'Your e-mail address'} {...register('email')} />
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
