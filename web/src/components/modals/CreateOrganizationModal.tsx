import { Box, Flex, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCloseModal } from '../../hooks/useCloseModal';
import { useCreateOrganization } from '../../mutations/organizations/useCreateOrganization';
import { FormActions } from '../FormActions';

export const CreateOrganizationModal = (): JSX.Element => {
	const [loading, setLoading] = useState<boolean>(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string>('');
	const {
		mutateAsync: createOrg,
		isPending,
		isError,
		error: mutateError
	} = useCreateOrganization();

	const { register, handleSubmit, reset } = useForm<{ name: string; password: string }>({
		defaultValues: {
			name: '',
			password: ''
		}
	});

	const closeModal = useCloseModal();

	const handleCreate = async (name: string, password: string) => {
		try {
			setLoading(true);
			// Create organization
			const response: AxiosResponse<{ errorCode: string; errorString: string }> =
				await createOrg({ name, password });

			if (response && response.data.errorCode === 'OK') {
				reset(); // Reset form values
				setSuccessMessage('Organization created successfully!');
				closeModal();
			} else {
				setCreateError('Something went wrong, make sure the name is unique');
			}

			setLoading(false);
		} catch (error) {
			setCreateError('Something went wrong, make sure that the name is unique');
			setLoading(false);
		}
	};

	return (
		<Box>
			<form
				onSubmit={handleSubmit(async (values) => {
					handleCreate(values.name, values.password);
				})}
			>
				<FormControl marginBottom={2}>
					<FormLabel htmlFor="name">Organization name</FormLabel>
					<Input type="name" {...register('name')} />
				</FormControl>

				<FormControl marginTop={2}>
					<FormLabel htmlFor="password">Organization password</FormLabel>
					<Input type="password" {...register('password')} />
				</FormControl>

				<FormActions
					submitText={'Create organization'}
					submitLoading={isPending}
					submitDisabled={isPending}
					cancelText={'Cancel'}
					onCancel={() => closeModal()}
				/>
				<Box p={2} mt={4}>
					<Flex justifyContent={'center'} alignItems={'center'}>
						{successMessage && <Text color="green.500">{successMessage}</Text>}

						{createError && <Text color="red.500">{createError}</Text>}
						{isError && <Text color="red.500">{mutateError?.code}</Text>}
					</Flex>
				</Box>
			</form>
		</Box>
	);
};
