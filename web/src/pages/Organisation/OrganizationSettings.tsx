import { ArrowBackIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Spacer,
	Text
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useLoginOrg } from '../../mutations/organizations/useLoginOrg';
import { useState } from 'react';
import { useGetUserInfo } from '../../queries/useGetUserInfo';
import { MemberTable } from './MemberTable';

export function OrganisationSettings() {
	const [showOrgs, setShowOrgs] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { data: userInfo } = useGetUserInfo();
	const currentOrganisation = userInfo?.organization;

	const { mutateAsync: loginOrg, isPending: loginPending } = useLoginOrg();
	const { register, handleSubmit } = useForm<{ password: string }>({
		defaultValues: { password: '' }
	});

	const handleLogin = async (password: string) => {
		try {
			setLoginError(null);
			const response = await loginOrg({ name: currentOrganisation?.name, password });
			if (response.errorCode === 'OK') {
				setShowOrgs(true);
				// handleCloseManage();
			} else if (response.errorCode === 'WRONG_USER_PASSWORD') {
				setLoginError('Wrong password');
			}
		} catch (error) {
			setLoginError('Invalid username or password, try again');
		}
	};

	return (
		<Box p={4}>
			<Button onClick={() => navigate(-1)} variant={'link'} colorScheme={'gray'}>
				<ArrowBackIcon />
			</Button>
			<Box>
				{showOrgs ? (
					<MemberTable activeOrg={currentOrganisation} />
				) : (
					<Flex justifyContent={'center'} alignItems={'center'}>
						<Box mt={4} w={'40%'}>
							<Heading size="md">Log in to Organization</Heading>
							<Box mt={2}>
								<form
									onSubmit={handleSubmit(
										(data) => currentOrganisation && handleLogin(data.password)
									)}
								>
									<FormControl marginBottom={2}>
										<FormLabel htmlFor="name">
											Active organization Name
										</FormLabel>
										<Input
											type="text"
											id="name"
											value={currentOrganisation?.name}
											isDisabled
										/>
									</FormControl>
									<FormControl marginBottom={2}>
										<FormLabel htmlFor="password">Password</FormLabel>
										<Input
											type="password"
											id="password"
											{...register('password')}
										/>
									</FormControl>
									<Flex marginTop={4} marginBottom={3}>
										<Box>
											<Button
												variant={'outline'}
												colorScheme="gray"
												onClick={() => navigate(-1)}
											>
												Cancel
											</Button>
										</Box>
										<Spacer />
										<Box>
											<Button
												type="submit"
												colorScheme="gray"
												isLoading={loginPending}
											>
												Login
											</Button>
										</Box>
									</Flex>
									{loginError && (
										<Flex
											justifyContent={'center'}
											alignItems={'center'}
											mt={3}
										>
											<Text color={'red.400'} fontWeight={'semibold'}>
												{loginError}
											</Text>
										</Flex>
									)}
								</form>
							</Box>
						</Box>
					</Flex>
				)}
			</Box>
		</Box>
	);
}
