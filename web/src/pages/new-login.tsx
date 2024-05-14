import React from 'react';

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

export const NewLogin = (): JSX.Element => {
	return (
		<Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
			<Tabs isFitted variant="enclosed">
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

const LoginForm = () => (
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
		</Box>
	</Stack>
);

const SignUpForm = () => (
	<Stack spacing="6">
		<Stack spacing="5">
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
