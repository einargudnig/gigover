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
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Theme } from '../Theme';
import { GigoverLogo } from '../components/GigoverLogo';
import { UserContext } from '../context/UserContext';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { ErrorTypes } from '../models/ErrorResponse';
import onboarding from '../onboarding.png';
import { RegistrationData, useRegister } from '../queries/useRegister';
import { devError } from '../utils/ConsoleUtils';

interface FormData extends Omit<RegistrationData, 'email' | 'type' | 'userName'> {
	name: string;
	address: string;
	zipCode: string;
	phoneNumber: string;
}

export const Onboarding = (): JSX.Element => {
	const user = useContext(UserContext);
	const firebase = useContext(FirebaseContext);
	const [registrationError, setRegistrationError] = useState('');
	const { mutateAsync: registerFn, data, isPending, isError, error } = useRegister();
	const navigate = useNavigate();

	// If the user already is registered, redirect to the dashboard
	useEffect(() => {
		if (user.registered) {
			navigate('/');
		}
	}, [navigate, user.registered]); // Dependency array with user.registered ensures useEffect runs when user.registered changes

	useEffect(() => {
		if (data?.data) {
			const resData = data.data;

			if (resData.errorCode === ErrorTypes.OK) {
				console.log('User registered successfully');
				// navigate to dashboard which is located at /
				navigate('/');
			} else if (resData.errorCode === ErrorTypes.NOT_LOGGED_IN) {
				firebase.signOut().then(() => {
					window.location.href = '/';
					alert('Invalid session, please log in again');
				});
			} else {
				setRegistrationError(
					'Could not register user. Reason code: ' +
						resData.errorCode +
						' Message: ' +
						resData.errorText
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>();

	const onSubmit = handleSubmit(async ({ name, address, zipCode, phoneNumber }) => {
		setRegistrationError('');
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
			setRegistrationError(e as string);
		}
	});

	return (
		<>
			<Box minH="100vh" p="4">
				<GigoverLogo scale={0.7} color="black" />

				<Box p={4}>
					<Grid gap={4} templateColumns="repeat(5, 1fr)">
						<GridItem colSpan={2}>
							<Box border={'1px'} borderColor={'gray.200'} p={4} rounded={'md'}>
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
									{/* mutation errors + more errors! */}
									{isError && (
										<>
											<Text color="red.500">{error?.message}</Text>
											<Text color="red.500" size={'sm'}>
												{error?.name}
											</Text>
										</>
									)}
									{registrationError.length > 0 && (
										<>
											<p style={{ color: 'red' }}>{registrationError}</p>
										</>
									)}
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
												<Text color="red.500">
													{errors.address.message}
												</Text>
											)}
										</FormControl>
										<FormControl id={'zipCode'} isInvalid={!!errors.zipCode}>
											<FormLabel>Zip code</FormLabel>
											<Input
												{...register('zipCode', {
													required: 'Zip code is required',
													maxLength: {
														value: 10,
														message:
															'Zip code no more than 10 digits long'
													}
												})}
											/>
											{errors.zipCode && (
												<Text color="red.500">
													{errors.zipCode.message}
												</Text>
											)}
										</FormControl>
										<Flex justifyContent={'flex-end'} marginTop="4">
											<Button
												disabled={isPending}
												isLoading={isPending}
												loadingText="Submitting"
												type="submit"
											>
												Register
											</Button>
										</Flex>
									</form>
								</Box>
							</Box>
							<Box marginTop={8}>
								<Text textColor={'black'}>
									We&apos;re thrilled to have you on board. Gigover is designed to
									simplify your construction management processes, from scheduling
									to resource allocation. Our intuitive dashboard and real-time
									updates will help you keep your projects on track and under
									budget. Let&apos;s build something great together! If you have
									any questions or need assistance as you navigate through the
									software, don&apos;t hesitate to reach out to our support team.
								</Text>
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
