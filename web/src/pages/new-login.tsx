import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GigoverLogo } from '../components/GigoverLogo';
import {
	Box,
	Button,
	Checkbox,
	Container,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Input,
	Link,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text
} from '@chakra-ui/react';
import { Firebase } from '../firebase/firebase';
import { FirebaseContext } from '../firebase/FirebaseContext';

export const NewLogin = (): JSX.Element => {
	return (
		<Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
			<Tabs
				isFitted
				variant="enclosed-colored"
				colorScheme="black"
				size="lg"
				rounded={'md'}
				shadow={'md'}
			>
				<TabList mb="1em">
					<Tab>Log In</Tab>
					<Tab>Sign Up</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<LoginForm />
					</TabPanel>
					<TabPanel>
						<SignUpForm />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Container>
	);
};

const LoginForm = () => {
	const [loading, setLoading] = useState<boolean>(false);
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
			setLoading(true);
			await firebase.auth.signInWithEmailAndPassword(email, password);
			setLoading(false);
		} catch (e) {
			console.error(e);
			setLoading(false);
		}
	};

	return (
		<Stack spacing="8">
			<Stack spacing="6">
				<Flex justifyContent={'center'} alignItems={'center'}>
					<GigoverLogo color={'black'} />
				</Flex>
				<Stack spacing={{ base: '2', md: '3' }} textAlign="center">
					<Heading size={{ base: 'xs', md: 'sm' }}>Log in to your account</Heading>
					<Text color="fg.muted">
						Don&apos;t have an account? <Link href="#">Sign up</Link>
					</Text>
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
					<Stack spacing="5">
						<form
							onSubmit={handleSubmit(async (values) => {
								loginWithCredentials(values.email, values.password);
							})}
						>
							<FormControl>
								<FormLabel htmlFor="email">Email</FormLabel>
								<Input type="email" {...register('email')} />
							</FormControl>

							<FormControl>
								<FormLabel htmlFor="password">Password</FormLabel>
								<Input type="password" {...register('password')} />
							</FormControl>
							<Stack spacing={'6'} marginTop={'4'}>
								<Button type={'submit'} isLoading={loading}>
									Log in
								</Button>
							</Stack>
						</form>
					</Stack>
					<Stack spacing="6">
						<HStack justify="center">
							<Button variant="text" size="sm">
								Forgot password?
							</Button>
						</HStack>
						<HStack>
							<Divider />
							<Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
								or continue with
							</Text>
							<Divider />
						</HStack>
						{/* OAuthButtonGroup can be added here */}
					</Stack>
				</Stack>
			</Box>
		</Stack>
	);
};

const SignUpForm = () => (
	<Stack spacing="6">
		<Stack spacing="5">
			<Flex justifyContent={'center'} alignItems={'center'}>
				<GigoverLogo color={'black'} />
			</Flex>
			<Stack spacing={{ base: '2', md: '3' }} textAlign="center">
				<Heading size={{ base: 'xs', md: 'sm' }}>Create a new account</Heading>
				<Text color="fg.muted">
					Already have an account? <Link href="#">Log in</Link>
				</Text>
			</Stack>
			<FormControl>
				<FormLabel htmlFor="email">Email</FormLabel>
				<Input id="email" type="email" />
			</FormControl>
			{/* Password field can be added here */}
		</Stack>
		<HStack justify="space-between">
			<Checkbox defaultChecked>Remember me</Checkbox>
			<Button variant="text" size="sm">
				Forgot password?
			</Button>
		</HStack>
		<Stack spacing="6">
			<Button>Sign in</Button>
			<HStack>
				<Divider />
				<Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
					or continue with
				</Text>
				<Divider />
			</HStack>
			{/* OAuthButtonGroup can be added here */}
		</Stack>
	</Stack>
);
