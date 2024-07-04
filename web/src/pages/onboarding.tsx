import React, { useContext, useEffect } from 'react';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	Input,
	Text
} from '@chakra-ui/react';
import onboarding from '../onboarding.png';
import { GigoverLogo } from '../components/GigoverLogo';
import { RegistrationData, useRegister } from '../queries/useRegister';
import { useForm } from 'react-hook-form';
import { UserContext } from '../context/UserContext';
import { devError } from '../utils/ConsoleUtils';
import { Theme } from '../Theme';

interface FormData extends Omit<RegistrationData, 'email' | 'type' | 'userName'> {
	name: string;
	address: string;
	zipCode: string;
	phoneNumber: string;
}

export const Onboarding = (): JSX.Element => {
	const user = useContext(UserContext);
	const { mutateAsync: registerFn, data, isLoading, isError, error } = useRegister();

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>();

	const onSubmit = handleSubmit(async ({ name, address, zipCode, phoneNumber }) => {
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
		}
	});

	return (
		<>
			{isError && (
				<>
					<Text color="red.500">{error?.errorText}</Text>
					<Text color="red.500" size={'sm'}>
						{error?.errorCode}
					</Text>
				</>
			)}

			<Box minH="100vh" p="4">
				<GigoverLogo scale={0.7} color="black" />

				<Box p={4}>
					<Grid gap={4} templateColumns="repeat(5, 1fr)">
						<GridItem
							colSpan={2}
							border={'1px'}
							borderColor={'gray.200'}
							p={4}
							rounded={'md'}
						>
							<Box>
								<Text fontSize="2xl" fontWeight="bold" textColor={'black'}>
									Welcome to Gigover!
								</Text>
								<Text fontSize="lg" marginTop={4}>
									We are excited to have you on board. Please fill in the
									following information to get started.
								</Text>
							</Box>
							<Box marginTop={6}>
								{/* Registration form */}
								<form onSubmit={onSubmit}>
									<FormControl id={'name'} isInvalid={!!errors.name}>
										<FormLabel>Name</FormLabel>
										<Input
											required={true}
											{...register('name', {
												required: 'Name is required',
												minLength: {
													value: 3,
													message:
														'Name must be at least 3 characters long'
												}
											})}
										/>
										{errors.name && (
											<Text color="red.500">{errors.name.message}</Text>
										)}
									</FormControl>
									<FormControl
										id={'phoneNumber'}
										isInvalid={!!errors.phoneNumber}
									>
										<FormLabel>Phone number</FormLabel>
										<Input
											{...register('phoneNumber', {
												required: 'Phone number is required',
												maxLength: {
													value: 10,
													message:
														'Phone number no more than 10 digits long'
												}
											})}
										/>
										{errors.phoneNumber && (
											<Text color="red.500">
												{errors.phoneNumber.message}
											</Text>
										)}
									</FormControl>
									<FormControl id={'address'} isInvalid={!!errors.address}>
										<FormLabel>Address</FormLabel>
										<Input
											{...register('address', {
												required: 'Address is required'
											})}
										/>
										{errors.address && (
											<Text color="red.500">{errors.address.message}</Text>
										)}
									</FormControl>
									<FormControl id={'zipCode'} isInvalid={!!errors.zipCode}>
										<FormLabel>Zip code</FormLabel>
										<Input
											{...register('zipCode', {
												required: 'Zip code is required'
											})}
										/>
										{errors.zipCode && (
											<Text color="red.500">{errors.zipCode.message}</Text>
										)}
									</FormControl>
									<Flex justifyContent={'flex-end'} marginTop="4">
										<Button
											disabled={isLoading}
											isLoading={isLoading}
											loadingText="Submitting"
											type="submit"
										>
											Submit
										</Button>
									</Flex>
								</form>
							</Box>
						</GridItem>
						<GridItem
							colSpan={3}
							position="relative"
							overflowX="visible"
							marginLeft={10}
							marginTop={8}
						>
							<Box
								position="absolute"
								right="-20%"
								backgroundColor={Theme.colors.yellow}
								p={6}
								rounded={'md'}
							>
								{' '}
								{/* Adjust the 'right' value to control how much the image overflows */}
								<img src={onboarding} alt="Onboarding" />
							</Box>
						</GridItem>
					</Grid>
				</Box>
			</Box>
		</>
	);
};
