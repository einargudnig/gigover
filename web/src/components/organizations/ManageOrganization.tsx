import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginOrg } from '../../mutations/organizations/useLoginOrg';
import { MemberTable } from '../../pages/Organisation/MemberTable';
import { GigoverLogo } from '../GigoverLogo';
import { CreateOrganization } from './CreateOrganization';

export const ManageOrganization = (): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	// const [showOrgs, setShowOrgs] = useState<boolean>(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const { mutateAsync: loginOrg, data, isLoading } = useLoginOrg();

	const { register, handleSubmit } = useForm<{ name: string; password: string }>({
		defaultValues: {
			name: '',
			password: ''
		}
	});

	const handleLogin = (name: string, password: string) => {
		try {
			setLoginError(null);
			// Login
			loginOrg({ name, password });
			// console.log({ data });
		} catch (error) {
			setLoginError('Invalid username or password');
		}
	};

	return (
		<div>
			<Button
				variant="outline"
				colorScheme="gray"
				onClick={onOpen}
				_hover={{ textColor: 'y.500' }}
			>
				Manage Organizations
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size={'6xl'}>
				<ModalOverlay />
				<ModalContent p={2}>
					<ModalCloseButton />
					<ModalBody>
						<Box>
							<Tabs align="center" defaultIndex={0} isFitted>
								<TabList>
									<Tab>Log in</Tab>
									<Tab>Organizations</Tab>
								</TabList>
								<TabPanels>
									<TabPanel>
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
												<Stack
													spacing={{ base: '2', md: '3' }}
													textAlign="center"
												>
													<Heading size={{ base: 'xs', md: 'sm' }}>
														Log in to your organisation
													</Heading>
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
															onSubmit={handleSubmit(
																async (values) => {
																	handleLogin(
																		values.name,
																		values.password
																	);
																}
															)}
														>
															<FormControl marginBottom={2}>
																<FormLabel htmlFor="username">
																	Username
																</FormLabel>
																<Input
																	type="username"
																	{...register('name')}
																/>
															</FormControl>

															<FormControl marginTop={2}>
																<FormLabel htmlFor="password">
																	Password
																</FormLabel>
																<Input
																	type="password"
																	{...register('password')}
																/>
															</FormControl>
															{loginError && (
																<Box marginTop={3}>
																	<Text
																		color="red.500"
																		fontSize="sm"
																	>
																		{loginError}
																	</Text>
																</Box>
															)}

															<Stack spacing="6" marginTop={4}>
																<Button
																	type={'submit'}
																	isLoading={isLoading}
																>
																	Log in
																</Button>
															</Stack>
														</form>
													</Stack>
												</Stack>
											</Box>
										</Stack>
									</TabPanel>
									<TabPanel>
										<MemberTable />
									</TabPanel>
									<TabPanel>
										<CreateOrganization />
									</TabPanel>
								</TabPanels>
							</Tabs>
						</Box>
					</ModalBody>
					{/* <ModalFooter>
						<Flex justifyContent={'space-between'}>
							<Box>
								<Button colorScheme="blue" mr={3} onClick={onClose}>
									Close
								</Button>
							</Box>
							<Spacer />
							<Box>
								<Button variant="ghost" colorScheme="black">
									Secondary Action
								</Button>
							</Box>
						</Flex>
					</ModalFooter> */}
				</ModalContent>
			</Modal>
		</div>
	);
};
