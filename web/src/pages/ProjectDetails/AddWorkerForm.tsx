import React from 'react';
import styled from 'styled-components';
import { useAddWorker } from '../../queries/useAddWorker';
import { useForm } from 'react-hook-form';
import { Input, InputWrapper } from '../../components/forms/Input';
import { Button } from '../../components/forms/Button';
import { useGetUserByPhoneNumber } from '../../queries/useGetUserByPhoneNumber';

const AddWorkerFormStyled = styled.div`
	flex: 0 0 360px;
`;

interface FormData {
	phoneNumber: string;
}

export const AddWorkerForm = ({ projectId }: { projectId: number }): JSX.Element => {
	const { register, handleSubmit, errors } = useForm<FormData>();
	const [getUserIdByPhoneNumber] = useGetUserByPhoneNumber();
	const [addWorker, { isLoading, isError, error }] = useAddWorker();

	const onSubmit = handleSubmit(async (data) => {
		const response = await getUserIdByPhoneNumber({ phoneNumber: data.phoneNumber });

		if (response) {
			await addWorker({
				projectId,
				uId: response.data.uId
			});
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
					<ul>{errors.phoneNumber && <li>{errors.phoneNumber}</li>}</ul>
				</>
			)}
			<form onSubmit={onSubmit}>
				<InputWrapper>
					<Input
						placeholder={'Enter phone number'}
						name={'phoneNumber'}
						maxLength={7}
						ref={register}
						required={true}
					/>
				</InputWrapper>
				<Button loading={isLoading} disabled={isLoading}>
					Add worker
				</Button>
			</form>
		</AddWorkerFormStyled>
	);
};
