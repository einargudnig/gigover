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
	Spacer,
	useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginOrg } from '../../mutations/organizations/useLoginOrg';
import { MemberTable } from '../../pages/Organisation/MemberTable';

export const ManageOrganization = (): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [showOrgs, setShowOrgs] = useState<boolean>(false);
	const [loginError, setLoginError] = useState<string | null>(null);

	const { mutateAsync: loginOrg, isLoading } = useLoginOrg();

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
			setShowOrgs(true);
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
							<Flex justifyContent={'space-between'}>
								<Box>
									<Heading size="lg">Manage Organizations</Heading>
								</Box>
								<Box>
									{showOrgs ? null : (
										<Button variant="outline" colorScheme="gray">
											Create organization
										</Button>
									)}
								</Box>
							</Flex>
							{showOrgs ? (
								<MemberTable />
							) : (
								<Box>
									<Heading size="md">Login to Organization</Heading>
									<Box>
										<form
											onSubmit={handleSubmit((data) =>
												handleLogin(data.name, data.password)
											)}
										>
											<FormControl marginBottom={2}>
												<FormLabel htmlFor="name">
													Organization Name
												</FormLabel>
												<Input
													type="text"
													id="name"
													{...register('name')}
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
													<Button variant={'outline'} colorScheme="gray">
														Cancel
													</Button>
												</Box>
												<Spacer />
												<Box>
													<Button
														type="submit"
														colorScheme="gray"
														isLoading={isLoading}
													>
														Login
													</Button>
												</Box>
											</Flex>
											{loginError && <Box>{loginError}</Box>}
										</form>
									</Box>
								</Box>
							)}
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
