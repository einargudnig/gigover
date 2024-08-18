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
	Th,
	Thead,
	Tr,
	useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAcceptOrganizationInvite } from '../../mutations/organizations/useAcceptOrganizationInvite';
import { useDeclineOrganizationInvite } from '../../mutations/organizations/useDeclineOrganizationInvite';
import { useGetUserOrgInvites } from '../../queries/organisations/useGetUserOrgInvites';

const dummyData = [
	{
		id: 0,
		orgName: 'Org1'
	},
	{
		id: 1,
		orgName: 'Org2'
	},
	{
		id: 2,
		orgName: 'Org3'
	},
	{
		id: 3,
		orgName: 'Org4'
	}
];

export const ManageOrganizationInvites = (): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const acceptInvite = useAcceptOrganizationInvite();
	const declineInvite = useDeclineOrganizationInvite();
	const [answerOrgId, setAnswerOrgId] = useState<number | null>(null);
	const [answerType, setAnswerType] = useState<'accept' | 'decline' | null>(null);
	const { data: userInvites } = useGetUserOrgInvites();
	console.log({ userInvites });

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

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Manage invites</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<TableContainer>
							<Table>
								<TableCaption>Manage organization invites</TableCaption>
								<Thead>
									<Tr>
										<Th>Organization</Th>
										<Th>Actions</Th>
									</Tr>
								</Thead>
								<Tbody>
									{dummyData.map((data) => (
										<Tr key={data.id}>
											<Th>{data.orgName}</Th>
											<Th>
												<Button
													onClick={() => acceptInvitation(data.id)}
													variant="outline"
													colorScheme="green"
													isLoading={
														answerOrgId === data.id &&
														answerType === 'accept'
													}
													size="sm"
													mr={2}
												>
													Accept
												</Button>
												<Button
													onClick={() => declineInvitation(data.id)}
													variant="outline"
													colorScheme="red"
													isLoading={
														answerOrgId === data.id &&
														answerType === 'decline'
													}
													size="sm"
												>
													Decline
												</Button>
											</Th>
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
