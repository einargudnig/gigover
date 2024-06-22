import React, { useContext } from 'react';
import { GigoverLogo } from '../../components/GigoverLogo';
import { UserContext } from '../../context/UserContext';
import {
	Avatar,
	Box,
	Flex,
	HStack,
	useColorModeValue,
	Text,
	useDisclosure,
	BoxProps,
	FlexProps,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Button
} from '@chakra-ui/react';
import { MemberTable } from './MemberTable';
import { FirebaseContext } from '../../firebase/FirebaseContext';
import { useLogout } from '../../mutations/useLogout';

export function Organisation() {
	const { onOpen, onClose } = useDisclosure();

	return (
		<Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
			<SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
			<MobileNav onOpen={onOpen} />
			<Flex ml={{ base: 0, md: 60 }} p="4">
				<MemberTable />
			</Flex>
		</Box>
	);
}

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	return (
		<Box
			transition="3s ease"
			bg="black"
			w={{ base: 'full', md: 60 }}
			pos="fixed"
			h="full"
			{...rest}
		>
			<Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
				<GigoverLogo scale={0.7} color="white" />
			</Flex>
			<Flex align="center" p="4" mx="4" borderRadius="lg" color={'white'}>
				<Text as="b">Organisation</Text>
			</Flex>
		</Box>
	);
};

interface MobileProps extends FlexProps {
	onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
	const { mutateAsync: logout } = useLogout();
	const user = useContext(UserContext);
	const firebase = useContext(FirebaseContext);

	return (
		<Flex
			ml={{ base: 0, md: 60 }}
			px={{ base: 4, md: 4 }}
			height="20"
			alignItems="center"
			bg={useColorModeValue('white', 'gray.900')}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
			justifyContent={{ base: 'space-between', md: 'flex-end' }}
			{...rest}
		>
			<Text
				display={{ base: 'flex', md: 'none' }}
				fontSize="2xl"
				fontFamily="monospace"
				fontWeight="bold"
			>
				<GigoverLogo scale={0.7} color="black" />
			</Text>

			<HStack spacing={{ base: '0', md: '6' }}>
				<Button size="lg" variant="ghost" aria-label="open menu" />
				<Flex alignItems={'center'}>
					<Menu>
						<MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
							<Avatar size={'sm'} name={user.userName} src={user.avatar} />
						</MenuButton>
						<MenuList
							bg={useColorModeValue('white', 'gray.900')}
							borderColor={useColorModeValue('gray.200', 'gray.700')}
						>
							<MenuItem
								onClick={async () => {
									await firebase.signOut();
									await logout(undefined, undefined);
								}}
							>
								Sign out
							</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</HStack>
		</Flex>
	);
};
