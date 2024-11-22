import {
	Box,
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Table,
	TableCaption,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAcceptOrganizationInvite } from '../../mutations/organizations/useAcceptOrganizationInvite';
import { useDeclineOrganizationInvite } from '../../mutations/organizations/useDeclineOrganizationInvite';
import { useGetUserInvites } from '../../queries/organisations/useGetUserInvites';
import { LoadingSpinner } from '../LoadingSpinner';

export const ManageOrganizationInvites = (): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const acceptInvite = useAcceptOrganizationInvite();
	const declineInvite = useDeclineOrganizationInvite();
	const { data, isLoading, isError, error } = useGetUserInvites();
	const [answerOrgId, setAnswerOrgId] = useState<number | null>(null);
	const [answerType, setAnswerType] = useState<'accept' | 'decline' | null>(null);

	const acceptInvitation = (id: number) => {
		setAnswerOrgId(id);
		setAnswerType('accept');
		acceptInvite.mutate({ id }, { onSettled: () => setAnswerOrgId(null) });
	};

	const declineInvitation = (id: number) => {
		setAnswerOrgId(id);
		setAnswerType('decline');
		declineInvite.mutate({ id }, { onSettled: () => setAnswerOrgId(null) });
	};

	return (
		<>
			<Button onClick={onOpen} variant="link" colorScheme="gray.300" p={-1} size="sm">
				Manage invites
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Manage invites to organizations</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box mx={6} mt={2} mb={4}>
							<Text>
								These are organizations that you have been invited to and you still
								have not answered
							</Text>
						</Box>
						<TableContainer>
							<Table>
								<TableCaption>Manage organization invites</TableCaption>
								<Thead>
									<Tr>
										<Th>Organization</Th>
										<Th>Privileges</Th>
										<Th>Actions</Th>
									</Tr>
								</Thead>
								<Tbody>
									{isError ? (
										<Flex justifyContent={'center'} alignItems={'center'}>
											<Text textColor={'red.500'} fontWeight={'semibold'}>
												{error?.errorCode} - {error?.errorText}
											</Text>
										</Flex>
									) : (
										<>
											{isLoading ? (
												<Flex
													justifyContent={'center'}
													alignItems={'center'}
												>
													<LoadingSpinner />
												</Flex>
											) : (
												<>
													{data.map((invite) => (
														<Tr key={invite.id}>
															<Td>{invite.name}</Td>
															<Td>{invite.priv}</Td>
															<Td>
																<Button
																	onClick={() =>
																		acceptInvitation(invite.id)
																	}
																	variant="outline"
																	colorScheme="green"
																	isLoading={
																		answerOrgId === invite.id &&
																		answerType === 'accept'
																	}
																	size="sm"
																	mr={2}
																>
																	Accept
																</Button>
																<Button
																	onClick={() =>
																		declineInvitation(invite.id)
																	}
																	variant="outline"
																	colorScheme="red"
																	isLoading={
																		answerOrgId === invite.id &&
																		answerType === 'decline'
																	}
																	size="sm"
																>
																	Decline
																</Button>
															</Td>
														</Tr>
													))}
												</>
											)}
										</>
									)}
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
