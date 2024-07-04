import {
	Box,
	Button,
	Container,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Heading,
	Input,
	Stack,
	Tab,
	TabList,
	TabPanels,
	Tabs,
	Text,
	VStack
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { GigoverLogo } from '../components/GigoverLogo';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { Firebase } from '../firebase/firebase';

export const NewLogin = (): JSX.Element => {
	const [currentForm, setCurrentForm] = useState<
		'login' | 'signup' | 'resetPassword' | 'organisationLogin'
	>('login');
	const [searchParams, setSearchParams] = useSearchParams();
	const tabIndex = parseInt(searchParams.get('tab') || '0');

	const handleTabsChange = (index: number) => {
		setSearchParams({ tab: index.toString() });
	};

	const handleSwitchForms = (
		form: 'login' | 'signup' | 'resetPassword' | 'organisationLogin'
	) => {
		setCurrentForm(form);
	};

	return (
		<Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
			<Tabs
				isFitted
				variant="enclosed-colored"
				colorScheme="black"
				size="lg"
				rounded={'md'}
				shadow={'md'}
				index={tabIndex}
				onChange={handleTabsChange}
			>
				<TabList mb="1em">
					<Tab onClick={() => handleSwitchForms('login')}>Log In</Tab>
					<Tab onClick={() => handleSwitchForms('signup')}>Sign Up</Tab>
				</TabList>
				<TabPanels>
					<Box>
						{currentForm === 'login' && (
							<LoginForm
								onForgotPassword={() => handleSwitchForms('resetPassword')}
								onOrganisationLogin={() => handleSwitchForms('organisationLogin')}
							/>
						)}
						{currentForm === 'signup' && <SignUpForm />}
						{currentForm === 'resetPassword' && (
							<ResetPasswordForm onBackToLogin={() => handleSwitchForms('login')} />
						)}
						{currentForm === 'organisationLogin' && (
							<OrganisationSignUpForm
								onBackToLogin={() => handleSwitchForms('login')}
							/>
						)}
					</Box>
				</TabPanels>
			</Tabs>
		</Container>
	);
};

const LoginForm = ({ onForgotPassword, onOrganisationLogin }): JSX.Element => {
	const [loading, setLoading] = useState<boolean>(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const firebase: Firebase = useContext(FirebaseContext);

	const { register, handleSubmit } = useForm<{ email: string; password: string }>({
		defaultValues: {
			email: '',
			password: ''
		}
	});

	// this function calls the firebase to log in the user with the provided credentials
	const loginWithCredentials = async (email: string, password: string) => {
		console.log({ email, password });
		try {
			setLoginError(null);
			setLoading(true);
			await firebase.auth.signInWithEmailAndPassword(email, password);
			setLoading(false);
		} catch (e) {
			console.error(e);
			setLoginError('Could not login user, invalid credentials');
			setLoading(false);
		}
	};

	const googleAuthenticate = async () => {
		try {
			setLoading(true);
			await firebase.signInWithGoogle();
			setLoading(false);
		} catch (e) {
			// Popup closed by user, or something failed..
			setLoading(false);
		}
	};

	return (
		<Stack spacing="8">
			<Stack spacing="6">
				<Flex
					justifyContent={'center'}
					alignItems={'center'}
					paddingTop={8}
					paddingBottom={6}
				>
					<GigoverLogo color={'black'} />
				</Flex>
				<Stack spacing={{ base: '2', md: '3' }} textAlign="center">
					<Heading size={{ base: 'xs', md: 'sm' }}>Log in to your account</Heading>

					<HStack justify={'center'} paddingTop={6}>
						<Button
							leftIcon={<GoogleIcon size={24} />}
							variant="outline"
							colorScheme="black"
							size="md"
							onClick={googleAuthenticate}
						>
							<Box>Continue with Google</Box>
						</Button>
					</HStack>
					<Box paddingX="6" paddingTop={4}>
						<HStack>
							<Divider />
							<Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
								or
							</Text>
							<Divider />
						</HStack>
					</Box>
				</Stack>
			</Stack>
			<Box
				py={{ base: '0', sm: '2' }}
				px={{ base: '4', sm: '10' }}
				bg={{ base: 'transparent', sm: 'bg.surface' }}
				boxShadow={{ base: 'none', sm: 'md' }}
				borderRadius={{ base: 'none', sm: 'xl' }}
			>
				<Stack spacing="6">
					<Stack spacing="5">
						<form
							onSubmit={handleSubmit(async (values) => {
								loginWithCredentials(values.email, values.password);
							})}
						>
							<FormControl marginBottom={2}>
								<FormLabel htmlFor="email">Email</FormLabel>
								<Input type="email" {...register('email')} />
							</FormControl>

							<FormControl marginTop={2}>
								<FormLabel htmlFor="password">Password</FormLabel>
								<Input type="password" {...register('password')} />
							</FormControl>
							{loginError && (
								<Box marginTop={3}>
									<Text color="red.500" fontSize="sm">
										{loginError}
									</Text>
								</Box>
							)}
							<Stack spacing={'6'} marginTop={4}>
								<Button type={'submit'} isLoading={loading}>
									Log in
								</Button>
							</Stack>
						</form>
					</Stack>
					<Stack paddingBottom={4}>
						<HStack justify="center">
							<VStack>
								<Button variant="text" size="sm" onClick={onForgotPassword}>
									Forgot password?
								</Button>
								<Button variant="text" size="sm" onClick={onOrganisationLogin}>
									<Text color="fg.muted">Log in to organisation</Text>
								</Button>
							</VStack>
						</HStack>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	);
};

const ResetPasswordForm = ({ onBackToLogin }): JSX.Element => {
	const [loading, setLoading] = useState<boolean>(false);
	const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const firebase: Firebase = useContext(FirebaseContext);

	const { register, handleSubmit } = useForm<{ email: string }>({
		defaultValues: {
			email: ''
		}
	});

	const resetPassword = async (email: string) => {
		console.log({ email });

		try {
			setResetPasswordError(null);
			setLoading(true);
			console.log('Resetting password');
			await firebase.resetPassword(email);
			console.log('Password reset email sent successfully.');
			setLoading(false);
			setSuccessMessage('Password reset email sent. Please check your inbox.');
		} catch (e) {
			setResetPasswordError('Resetting password failed');
			console.log(e);
			// Popup closed by user, or something failed..
			setLoading(false);
		}
	};

	return (
		<Stack spacing="6">
			<Stack spacing="5">
				<Flex justifyContent={'center'} alignItems={'center'}>
					<GigoverLogo color={'black'} />
				</Flex>
				<Stack spacing={{ base: '2', md: '3' }} textAlign="center">
					<Heading size={{ base: 'xs', md: 'sm' }}>Reset your password</Heading>
				</Stack>
			</Stack>
			<Box
				py={{ base: '0', sm: '8' }}
				px={{ base: '4', sm: '10' }}
				bg={{ base: 'transparent', sm: 'bg.surface' }}
				boxShadow={{ base: 'none', sm: 'md' }}
				borderRadius={{ base: 'none', sm: 'xl' }}
			>
				<Stack spacing="6">
					<Stack>
						<form
							onSubmit={handleSubmit(async (values) => {
								resetPassword(values.email);
							})}
						>
							<FormControl>
								<FormLabel htmlFor="email">Email</FormLabel>
								<Input type="email" {...register('email')} />
							</FormControl>
							{resetPasswordError && (
								<Box marginTop={3}>
									<Text color="red.500" fontSize="sm">
										{resetPasswordError}
									</Text>
								</Box>
							)}
							<Stack spacing={'6'} marginTop={4}>
								<Button type="submit" isLoading={loading}>
									Reset password
								</Button>
							</Stack>
						</form>
						{successMessage && (
							<Box marginTop={3}>
								<Text color="green.500" fontSize="sm">
									{successMessage}
								</Text>
							</Box>
						)}
					</Stack>
					<HStack justify={'center'}>
						<Text color="fg.muted">
							<Button variant="text" onClick={onBackToLogin}>
								Back to Log in
							</Button>
						</Text>
					</HStack>
				</Stack>
			</Box>
		</Stack>
	);
};

const SignUpForm = () => {
	const firebase: Firebase = useContext(FirebaseContext);
	const [loading, setLoading] = useState<boolean>(false);
	const [registerError, setRegisterError] = useState<string | null>(null);

	const { register, handleSubmit } = useForm<{ email: string; password: string }>({
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const signUp = async (email: string, password: string) => {
		try {
			setRegisterError(null);
			setLoading(true);
			await firebase.auth.createUserWithEmailAndPassword(email, password);
			setLoading(false);
		} catch (e) {
			console.error(e);
			setRegisterError('Could not register user, this email may be registered already.');
			// Popup closed by user, or something failed..
			setLoading(false);
		}
	};

	const googleAuthenticate = async () => {
		try {
			setLoading(true);
			await firebase.signInWithGoogle();
			setLoading(false);
		} catch (e) {
			// Popup closed by user, or something failed..
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
					<Heading size={{ base: 'xs', md: 'sm' }}>Create a new account</Heading>

					<HStack justify={'center'} paddingTop={6}>
						<Button
							leftIcon={<GoogleIcon size={24} />}
							variant="outline"
							colorScheme="black"
							size="md"
							onClick={googleAuthenticate}
						>
							<Box>Sign up with Google</Box>
						</Button>
					</HStack>

					<Box paddingX="6" paddingTop={4}>
						<HStack>
							<Divider />
							<Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
								or
							</Text>
							<Divider />
						</HStack>
					</Box>
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
								signUp(values.email, values.password);
							})}
						>
							<FormControl marginBottom={2}>
								<FormLabel htmlFor="email">Email</FormLabel>
								<Input type="email" {...register('email')} />
							</FormControl>

							<FormControl marginTop={2}>
								<FormLabel htmlFor="password">Password</FormLabel>
								<Input type="password" {...register('password')} />
							</FormControl>
							{registerError && (
								<Box marginTop={3}>
									<Text color="red.500" fontSize="sm">
										{registerError}
									</Text>
								</Box>
							)}

							<Stack spacing="6" marginTop={4}>
								<Button type={'submit'} isLoading={loading}>
									Sign up
								</Button>
							</Stack>
						</form>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	);
};

const OrganisationSignUpForm = ({ onBackToLogin }) => {
	const firebase: Firebase = useContext(FirebaseContext);
	const [loading, setLoading] = useState<boolean>(false);
	const [registerError, setRegisterError] = useState<string | null>(null);

	const { register, handleSubmit } = useForm<{ username: string; password: string }>({
		defaultValues: {
			username: '',
			password: ''
		}
	});

	const signUp = async (username: string, password: string) => {
		try {
			setRegisterError(null);
			setLoading(true);
			// start with dummy login!
			await firebase.auth.signInWithEmailAndPassword(username, password);
			setLoading(false);
		} catch (e) {
			console.error(e);
			setRegisterError('Could not log in to organisation!');
			// Popup closed by user, or something failed..
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
					<Heading size={{ base: 'xs', md: 'sm' }}>Log in to your organisation</Heading>
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
								signUp(values.username, values.password);
							})}
						>
							<FormControl marginBottom={2}>
								<FormLabel htmlFor="username">Username</FormLabel>
								<Input type="username" {...register('username')} />
							</FormControl>

							<FormControl marginTop={2}>
								<FormLabel htmlFor="password">Password</FormLabel>
								<Input type="password" {...register('password')} />
							</FormControl>
							{registerError && (
								<Box marginTop={3}>
									<Text color="red.500" fontSize="sm">
										{registerError}
									</Text>
								</Box>
							)}

							<Stack spacing="6" marginTop={4}>
								<Button type={'submit'} isLoading={loading}>
									Sign up
								</Button>
							</Stack>
						</form>
					</Stack>
				</Stack>
				<HStack justify={'center'}>
					<Button variant="text" onClick={onBackToLogin}>
						<Text color="fg.muted">Back to Log in</Text>
					</Button>
				</HStack>
			</Box>
		</Stack>
	);
};
