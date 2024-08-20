import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateOrganization } from '../../mutations/organizations/useCreateOrganization';
import { LoadingSpinner } from '../LoadingSpinner';

export const CreateOrganization = (): JSX.Element => {
	const [loading, setLoading] = useState<boolean>(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string>('');
	const {
		mutateAsync: createOrg,
		isLoading,
		isError,
		error: mutateError
	} = useCreateOrganization();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { register, handleSubmit, reset } = useForm<{ name: string; password: string }>({
		defaultValues: {
			name: '',
			password: ''
		}
	});

	const handleCreate = async (name: string, password: string) => {
		try {
			setLoading(true);
			// Create organization
			const response: AxiosResponse<{ errorCode: string; errorString: string }> =
				await createOrg({ name, password });

			if (response && response.data.errorCode === 'OK') {
				reset(); // Reset form values
				setSuccessMessage('Organization created successfully!');
				onClose();
			} else {
				setCreateError('Something went wrong');
			}

			setLoading(false);
		} catch (error) {
			setCreateError('Something went wrong');
			setLoading(false);
		}
	};

	return (
		<>
			<Button onClick={onOpen} variant={'link'} colorScheme="gray.300" p={-1} size={'sm'}>
				Create an organization
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create an organization</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
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

							<Stack spacing="6" marginTop={4}>
								<Button
									type="submit"
									width={'full'}
									variant={'outline'}
									colorScheme="gray"
								>
									{isLoading || loading ? (
										<LoadingSpinner />
									) : (
										'Create organization'
									)}
								</Button>
							</Stack>
							<Box p={2} mt={4}>
								<Flex justifyContent={'center'} alignItems={'center'}>
									{successMessage && (
										<Text color="green.500">{successMessage}</Text>
									)}

									{createError && <Text color="red.500">{createError}</Text>}
									{isError && <Text color="red.500">{mutateError?.code}</Text>}
								</Flex>
							</Box>
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
