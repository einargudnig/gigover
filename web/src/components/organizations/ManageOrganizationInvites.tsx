import {
	Button,
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
	Th,
	Thead,
	Tr,
	useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAcceptOrganizationInvite } from '../../mutations/organizations/useAcceptOrganizationInvite';
import { useDeclineOrganizationInvite } from '../../mutations/organizations/useDeclineOrganizationInvite';
import { useGetUserInvites } from '../../queries/organisations/useGetUserInvites';

const dummyData = [
	{
		id: 0,
		orgName: 'Org1Name'
	},
	{
		id: 1,
		orgName: 'Org2Name'
	},
	{
		id: 2,
		orgName: 'Org3Name'
	},
	{
		id: 3,
		orgName: 'Org4Name'
	}
];

export const ManageOrganizationInvites = (): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const acceptInvite = useAcceptOrganizationInvite();
	const declineInvite = useDeclineOrganizationInvite();
	const { data, isLoading, isError, error } = useGetUserInvites();
	console.log('userInvites', { data });
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
									{data.map((invite) => (
										<Tr key={invite.id}>
											{/* <Th>{data.orgName}</Th> */}
											<Td>orgName</Td>
											<Td>{invite.priv}</Td>
											<Td>
												<Button
													onClick={() => acceptInvitation(invite.id)}
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
													onClick={() => declineInvitation(invite.id)}
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
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
