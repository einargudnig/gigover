import { Box, Button, FormLabel, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAddWorker } from '../../queries/useAddWorker';
import { useGetUserByPhoneNumber } from '../../queries/useGetUserByPhoneNumber';

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
	const { mutateAsync: getUserIdByPhoneNumber, isPending: loading } = useGetUserByPhoneNumber();
	const { mutateAsync: addWorker, isPending, isError, error } = useAddWorker();

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
		<Box flexBasis="360px" flexShrink={0}>
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
						maxLength={7}
						{...register('phoneNumber')}
						required={true}
					/>
				</Box>
				<Button
					type={'submit'}
					isLoading={loading || isPending}
					loadingText={'Searching'}
					disabled={loading || isPending}
				>
					Add app user
				</Button>
			</form>
		</Box>
	);
};
