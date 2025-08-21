import {
	Avatar,
	Box,
	Link as ChakraLink,
	Fade,
	Flex,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList,
	Text,
	VStack
} from '@chakra-ui/react';
import React, { Suspense, useContext } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Theme } from '../Theme';
import { UserContext } from '../context/UserContext';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { useLogout } from '../mutations/useLogout';
import { Center } from './Center';
import { DevMenu } from './DevMenu';
import { GigoverLogo } from './GigoverLogo';
import { LoadingSpinner } from './LoadingSpinner';
import { FolderIcon } from './icons/FolderIcon';
import { ProjectIcon } from './icons/ProjectIcon';
import { PropertyIcon } from './icons/PropertyIcon';
import { TenderIcon } from './icons/TenderIcon';
import { TimeIcon } from './icons/TimeIcon';
import { ToolsIcon } from './icons/ToolsIcon';
import { Notifications } from './notifications/Notifications';
import { OrganizationSwitcher } from './organizations/OrganizationSwitcher';

const NavItem = ({ to, icon, children, onClick }) => {
	const location = useLocation();
	const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

	return (
		<ChakraLink
			as={NavLink}
			to={to}
			end={to === '/'}
			onClick={onClick}
			display="flex"
			alignItems="center"
			my={2}
			mx={2}
			fontWeight="bold"
			color={isActive ? 'yellow.400' : 'gray.500'}
			_hover={{ textDecoration: 'none' }}
		>
			<Box mr={3} ml={1}>
				{React.cloneElement(icon, {
					color: isActive ? Theme.colors.yellow : Theme.colors.white
				})}
			</Box>
			<Text>{children}</Text>
		</ChakraLink>
	);
};

export const Page = ({ backgroundColor, onLinkClick }: PageProps): JSX.Element | null => {
	const { mutateAsync: logout } = useLogout();
	const user = useContext(UserContext);
	const firebase = useContext(FirebaseContext);

	if (user === null) {
		return null;
	}

	return (
		<Flex width="100vw" height="100vh" overflow="hidden">
			{/* Sidebar */}
			<Flex
				bg="black"
				width="220px"
				flexShrink={0}
				p={8}
				flexDirection="column"
				justifyContent="space-between"
				alignItems="flex-start"
			>
				<Box>
					<ChakraLink as={Link} to="/" onClick={onLinkClick}>
						<GigoverLogo scale={0.7} />
					</ChakraLink>
				</Box>
				<VStack as="nav" align="stretch" spacing={0} width="100%">
					<NavItem to="/" icon={<ProjectIcon />} onClick={onLinkClick}>
						Projects
					</NavItem>
					<NavItem to="/property" icon={<PropertyIcon />} onClick={onLinkClick}>
						Properties
					</NavItem>
					<NavItem
						to="/files"
						icon={<FolderIcon color={Theme.colors.white} type="bold" />}
						onClick={onLinkClick}
					>
						File storage
					</NavItem>
					<NavItem
						to="/resources"
						icon={<ToolsIcon color={Theme.colors.white} type="bold" />}
						onClick={onLinkClick}
					>
						Resources
					</NavItem>
					<NavItem to="/time-tracker" icon={<TimeIcon />} onClick={onLinkClick}>
						Reports
					</NavItem>
					<NavItem to="/tender" icon={<TenderIcon />} onClick={onLinkClick}>
						Tenders
					</NavItem>

					{/* <NavItem to="/settings" icon={<SettingsIcon />} onClick={onLinkClick}>
						Settings
					</NavItem> */}
				</VStack>

				<Text fontSize="xs" color="gray.700" userSelect="none">
					v2.0
				</Text>
			</Flex>

			{/* Main Content */}
			<Flex
				flex={1}
				flexDirection="column"
				bg={Theme.colors.blueBackground}
				maxWidth="calc(100vw - 240px)"
			>
				{/* Top User Bar */}
				<Box p={2} bg="white" borderBottom="1px" borderColor="gray.300">
					<Flex justifyContent="flex-end">
						<Flex pr={3}>
							<OrganizationSwitcher />
							<Notifications />
							<Menu>
								<MenuButton ml={2}>
									<Avatar size="sm" name={user.email} src={user.avatar} />
								</MenuButton>
								<MenuList>
									<MenuGroup title={user.name}>
										<MenuItem>
											<Link to={'/settings'}>Settings</Link>
										</MenuItem>
										<MenuItem
											onClick={async () => {
												console.log('firebase signout');
												await firebase.signOut();
												console.log('API log out');
												await logout(undefined, undefined);
											}}
										>
											Log out
										</MenuItem>
									</MenuGroup>
								</MenuList>
							</Menu>
						</Flex>
					</Flex>
				</Box>

				{/* Page Content */}
				<Box
					flex={1}
					maxHeight="100%"
					maxWidth="100%"
					overflowX="hidden"
					overflowY="auto"
					bg={backgroundColor}
				>
					<Suspense
						fallback={
							<Center>
								<LoadingSpinner />
							</Center>
						}
					>
						<Fade in={true} style={{ flex: 1, height: '100%' }}>
							<Outlet />
						</Fade>
					</Suspense>
				</Box>
			</Flex>
			<DevMenu />
		</Flex>
	);
};
