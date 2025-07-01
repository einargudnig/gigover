import {
	Box,
	Button,
	Flex,
	Table,
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
// import { useGetUserInvites } from '../../queries/organisations/useGetUserInvites';
import { LoadingSpinner } from '../LoadingSpinner';

export const ManageOrganizationInvites = (): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const acceptInvite = useAcceptOrganizationInvite();
	const declineInvite = useDeclineOrganizationInvite();
	// const { data, isPending, isError, error } = useGetUserInvites();

	// Dummy data and mock states for development
	const dummyInvites = [
		{ id: 1, name: 'Acme Corp', priv: 'Admin' },
		{ id: 2, name: 'Beta LLC', priv: 'Viewer' },
		{ id: 3, name: 'Gamma Inc', priv: 'Editor' }
	];
	const data = dummyInvites;
	const isPending = false;
	const isError = false;
	const error = null;
	const [answerOrgId, setAnswerOrgId] = useState<number | null>(null);
	const [answerType, setAnswerType] = useState<'accept' | 'decline' | null>(null);

	const acceptInvitation = (id: number) => {
		setAnswerOrgId(id);
		setAnswerType('accept');
		acceptInvite.mutate(id, { onSettled: () => setAnswerOrgId(null) });
	};

	const declineInvitation = (id: number) => {
		setAnswerOrgId(id);
		setAnswerType('decline');
		declineInvite.mutate(id, { onSettled: () => setAnswerOrgId(null) });
	};

	return (
		<Box>
			<Text fontWeight={'bold'} color={'gray.700'}>
				Manage invites
			</Text>

			{dummyInvites.length > 0 ? (
				<>
					<Box mx={6} mt={2} mb={4}>
						<Text>
							These are organizations that you have been invited to and you still have
							not answered
						</Text>
					</Box>
					<TableContainer>
						<Table>
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
											{isError
												? 'An error occurred while fetching invites.'
												: ''}
										</Text>
									</Flex>
								) : (
									<>
										{isPending ? (
											<Flex justifyContent={'center'} alignItems={'center'}>
												<LoadingSpinner />
											</Flex>
										) : (
											<>
												{dummyInvites.map((invite) => (
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
				</>
			) : (
				<Text>No invites</Text>
			)}
		</Box>
	);
};
