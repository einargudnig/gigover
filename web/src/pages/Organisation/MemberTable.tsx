import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spacer,
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
import { InviteUserToOrg } from '../../components/InviteUser/InviteUserToOrg';
import { VerticalDots } from '../../components/icons/VerticalDots';

const dummyData = [
	{
		id: 1,
		name: 'Heimir Hermannson',
		email: 'heimir@gigover.com',
		access: 'Admin',
		status: 'Joined'
	},
	{
		id: 2,
		name: 'Helgi Hermannson',
		email: 'helgi@gigover.com',
		access: 'Editor',
		status: 'Joined'
	},
	{
		id: 3,
		name: 'Juyeon Lee',
		email: 'juyeon@gigover.com',
		access: 'Editor',
		status: 'Joined'
	},
	{
		id: 4,
		name: 'Lyuba Kharitonova',
		email: 'lyuba@gigover.com',
		access: 'Viewer',
		status: 'Invited'
	}
];

export function MemberTable() {
	const [members, setMembers] = useState(dummyData);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const removeUser = (index: number) => {
		const newMembers = [...members];
		newMembers.splice(index, 1);
		console.log({ newMembers });
		setMembers(newMembers);
	};

	const makeViewer = (index: number) => {
		const newMembers = [...members];
		newMembers[index].access = 'Viewer';
		setMembers(newMembers);
	};

	const makeEditor = (index: number) => {
		const newMembers = [...members];
		newMembers[index].access = 'Editor';
		setMembers(newMembers);
	};

	const makeAdmin = (index: number) => {
		const newMembers = [...members];
		newMembers[index].access = 'Admin';
		setMembers(newMembers);
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Invite Members</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<InviteUserToOrg />
					</ModalBody>
					<ModalFooter mt={-16}>
						<Flex width={'full'}>
							<Button colorScheme="grey" variant={'outline'} mr={3} onClick={onClose}>
								Close
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Box width="full">
				<Box>
					<Flex alignItems={'center'}>
						<Heading size={'md'}>Member Table</Heading>
						<Spacer />
						<Box>
							<Button onClick={onOpen}>Invite Members</Button>
						</Box>
					</Flex>
				</Box>

				<TableContainer>
					<Table variant="striped">
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Email</Th>
								<Th>Access</Th>
								<Th>Status</Th>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody>
							{members.map((data, index) => (
								<Tr key={index}>
									<Td>
										<Flex alignItems={'center'}>
											<Avatar
												size="sm"
												name={data.name}
												src={`https://bit.ly/${data.name}`}
											/>
											<Text marginLeft={1} color="black">
												{data.name}
											</Text>
										</Flex>
									</Td>
									<Td>{data.email}</Td>
									<Td>{data.access}</Td>
									<Td>{data.status}</Td>
									<Td>
										<Menu>
											<MenuButton>
												<VerticalDots />
											</MenuButton>
											<MenuList>
												<MenuItem onClick={() => makeAdmin(index)}>
													Make admin
												</MenuItem>
												<MenuItem onClick={() => makeEditor(index)}>
													Make editor
												</MenuItem>
												<MenuItem onClick={() => makeViewer(index)}>
													Make viewer
												</MenuItem>
												<Divider />
												<MenuItem onClick={() => removeUser(index)}>
													Remove
												</MenuItem>
											</MenuList>
										</Menu>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
		</>
	);
}
