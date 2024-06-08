import React, { useState } from 'react';
import {
	Avatar,
	Box,
	Flex,
	Heading,
	Table,
	TableContainer,
	Tbody,
	Text,
	Td,
	Th,
	Thead,
	Tr,
	Spacer,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Divider,
	useDisclosure,
	Modal,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalOverlay,
	ModalCloseButton,
	Input
} from '@chakra-ui/react';
import { VerticalDots } from '../../components/icons/VerticalDots';

const dummyData = [
	{
		name: 'Heimir Hermannson',
		email: 'heimir@gigover.com',
		access: 'Admin',
		status: 'Joined'
	},
	{
		name: 'Helgi Hermannson',
		email: 'helgi@gigover.com',
		access: 'Editor',
		status: 'Joined'
	},
	{
		name: 'Juyeon Lee',
		email: 'juyeon@gigover.com',
		access: 'Editor',
		status: 'Joined'
	},
	{
		name: 'Lyuba Kharitonova',
		email: 'lyuba@gigover.com',
		access: 'Viewer',
		status: 'Invited'
	}
];

export function MemberTable() {
	const [members, setMembers] = useState(dummyData);
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Invite Members</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Invite members to your organisation</Text>

						<Input marginY={2} placeholder="Member email" />

						<Text fontSize={'sm'}>
							If the member does not have a gigover account he will be sent an email.
						</Text>
					</ModalBody>
					<ModalFooter>
						<Flex width={'full'}>
							<Button colorScheme="grey" variant={'outline'} mr={3} onClick={onClose}>
								Close
							</Button>
							<Spacer />
							<Button>Invite</Button>
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
												<MenuItem>Make admin</MenuItem>
												<MenuItem>Make editor</MenuItem>
												<MenuItem>Make viewer</MenuItem>
												<Divider />
												<MenuItem>Remove</MenuItem>
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
