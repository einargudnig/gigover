import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Spacer,
	Text,
	Tooltip,
	useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginOrg } from '../../mutations/organizations/useLoginOrg';
import { MemberTable } from '../../pages/Organisation/MemberTable';
import { useGetUserInfo } from '../../queries/useGetUserInfo';
import { DisabledComponent } from '../disabled/DisabledComponent';
import { CreateOrganization } from './CreateOrganization';
import { OrganizationSwitcher } from './OrganizationSwitcher';

export const ManageOrganization = (): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [showOrgs, setShowOrgs] = useState<boolean>(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const { data: org } = useGetUserInfo();
	const activeOrg = org?.organization;

	const { mutateAsync: loginOrg, isPending } = useLoginOrg();

	const { register, handleSubmit, reset } = useForm<{ name: string; password: string }>({
		defaultValues: {
			name: '',
			password: ''
		}
	});

	const handleLogin = async (password: string) => {
		try {
			setLoginError(null);

			const orgName = activeOrg?.name;
			const response = await loginOrg({ name: orgName, password });
			console.log(response);
			if (response.errorCode === 'OK') {
				setShowOrgs(true);
				reset();
			} else if (response.errorCode === 'WRONG_USER_PASSWORD') {
				setLoginError('');
			}
		} catch (error) {
			setLoginError('Invalid username or password, try again');
		}
	};

	const handleClose = () => {
		setShowOrgs(false);
		onClose(); // Ensure to call the onClose from useDisclosure to handle internal state
		reset();
	};

	return (
		<div>
			<DisabledComponent>
				<Button variant="link" colorScheme="gray.300" onClick={onOpen} size={'sm'}>
					Manage active organization
				</Button>
			</DisabledComponent>

			<Modal isOpen={isOpen} onClose={handleClose} size={'6xl'}>
				<ModalOverlay />
				<ModalContent p={2}>
					<ModalCloseButton />
					<ModalBody>
						<Box>
							<Flex justifyContent={'space-between'} alignItems={'center'}>
								<Box>
									<Heading size="lg">Manage Organizations</Heading>
								</Box>
								<Box>
									{showOrgs ? null : (
										<Box mr={3}>
											<CreateOrganization />
										</Box>
									)}
								</Box>
							</Flex>
							{activeOrg ? (
								<>
									{showOrgs ? (
										<MemberTable activeOrg={activeOrg} />
									) : (
										<Flex justifyContent={'center'} alignItems={'center'}>
											<Box mt={4} w={'500px'}>
												<Heading size="md">Log in to Organization</Heading>
												<Box mt={2}>
													<form
														onSubmit={handleSubmit((data) =>
															handleLogin(data.password)
														)}
													>
														<FormControl marginBottom={2}>
															<FormLabel htmlFor="name">
																Active organization Name
															</FormLabel>
															<Tooltip label="To change the active organization, use the organization switcher">
																<Input
																	type="text"
																	id="name"
																	value={activeOrg?.name}
																	isDisabled
																/>
															</Tooltip>
														</FormControl>
														<FormControl marginBottom={2}>
															<FormLabel htmlFor="password">
																Password
															</FormLabel>
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
																	onClick={handleClose}
																>
																	Cancel
																</Button>
															</Box>
															<Spacer />
															<Box>
																<Button
																	type="submit"
																	colorScheme="gray"
																	isLoading={isPending}
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
																<Text
																	color={'red.400'}
																	fontWeight={'semibold'}
																>
																	{loginError}
																</Text>
															</Flex>
														)}
													</form>
												</Box>
											</Box>
										</Flex>
									)}
								</>
							) : (
								<>
									<Flex justifyContent={'center'} alignItems={'center'} mt={10}>
										<Flex flexDirection={'column'} alignItems={'center'}>
											<Text
												fontSize={'xl'}
												fontWeight={'semibold'}
												textColor={'gray.800'}
											>
												You need to select an organization before logging
												in!
											</Text>
											<Box mt={4}>
												<HStack>
													<Text textColor={'gray.600'}>
														Select organization:{' '}
													</Text>
													<OrganizationSwitcher />
												</HStack>
											</Box>
										</Flex>
									</Flex>
								</>
							)}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	);
};
