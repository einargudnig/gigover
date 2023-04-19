import React from 'react';
import styled from 'styled-components';
import { useAddWorker } from '../../queries/useAddWorker';
import { useForm } from 'react-hook-form';
import { Box, Input, Button, FormLabel } from '@chakra-ui/react';
import { useGetUserByPhoneNumber } from '../../queries/useGetUserByPhoneNumber';

const AddWorkerFormStyled = styled.div`
	flex: 0 0 360px;
`;

interface FormData {
	phoneNumber: string;
}

export const AddWorkerForm = ({ projectId }: { projectId: number }): JSX.Element => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<FormData>();
	const { mutateAsync: getUserIdByPhoneNumber, isLoading: loading } = useGetUserByPhoneNumber();
	const { mutateAsync: addWorker, isLoading, isError, error } = useAddWorker();

	const onSubmit = handleSubmit(async (data) => {
		const response = await getUserIdByPhoneNumber({ phoneNumber: data.phoneNumber });

		if (response) {
			await addWorker({
				projectId,
				uId: response.data.uId
			});
			reset();
		} else {
			// eslint-disable-next-line no-console
			console.error('Error getting user id by phone.');
		}
	});

	return (
		<AddWorkerFormStyled>
			{isError && (
				<>
					{/* Server errors */}
					<p>{error?.errorText}</p>
					<small>{error?.errorCode}</small>
				</>
			)}
			{errors && (
				<>
					<ul>{errors.phoneNumber && <li>{errors.phoneNumber.message}</li>}</ul>
				</>
			)}
			<form onSubmit={onSubmit}>
				<Box mb={4}>
					<FormLabel htmlFor={'phoneNumber'}>Phone number</FormLabel>
					<Input
						placeholder={'Enter phone number'}
						name={'phoneNumber'}
						maxLength={7}
						{...register}
						required={true}
					/>
				</Box>
				<Button
					type={'submit'}
					isLoading={loading || isLoading}
					loadingText={'Searching'}
					disabled={loading || isLoading}
				>
					Add app user
				</Button>
			</form>
		</AddWorkerFormStyled>
	);
};
