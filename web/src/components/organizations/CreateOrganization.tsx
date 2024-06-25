import React, { useState } from 'react';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	Text
} from '@chakra-ui/react';
import { GigoverLogo } from '../GigoverLogo';
import { useForm } from 'react-hook-form';
import { useCreateOrganization } from '../../mutations/organizations/useCreateOrganization';
import { LoadingSpinner } from '../LoadingSpinner';
import { AxiosResponse } from 'axios';

export const CreateOrganization = (): JSX.Element => {
	const [loading, setLoading] = useState<boolean>(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string>('');
	const { mutateAsync: createOrg, isLoading } = useCreateOrganization();

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
			console.log({ response });

			if (response && response.data.errorCode === 'OK') {
				reset(); // Reset form values
				setSuccessMessage('Organization created successfully!');
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
		<Stack spacing="8">
			<Stack spacing="5">
				<Flex
					justifyContent={'center'}
					alignItems={'center'}
					paddingTop={8}
					paddingBottom={6}
				>
					<GigoverLogo color={'black'} />
				</Flex>
				<Stack spacing={{ base: '2', md: '3' }} textAlign="center">
					<Heading size={{ base: 'xs', md: 'sm' }}>Create a new organization</Heading>
				</Stack>
			</Stack>
			<Box
				py={{ base: '0', sm: '2' }}
				px={{ base: '4', sm: '10' }}
				bg={{ base: 'transparent', sm: 'bg.surface' }}
				boxShadow={{ base: 'none', sm: 'md' }}
				borderRadius={{ base: 'none', sm: 'xl' }}
			>
				<Stack spacing="6" paddingBottom={8}>
					<Stack spacing="5">
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
								<Button type="submit">
									{isLoading || loading ? (
										<LoadingSpinner />
									) : (
										'Create organization'
									)}
								</Button>
							</Stack>

							{successMessage && <Text color="green.500">{successMessage}</Text>}

							{createError && <Text color="red.500">{createError}</Text>}
						</form>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	);
};
