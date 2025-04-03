import {
	Avatar,
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Link as ChakraLink,
	Fade,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList,
	Text,
	VStack
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Theme } from '../Theme';
import { UserContext } from '../context/UserContext';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { useLogout } from '../mutations/useLogout';
import { DevMenu } from './DevMenu';
import { GigoverLogo } from './GigoverLogo';
import { Chevron } from './icons/Chevron';
import { FolderIcon } from './icons/FolderIcon';
import { ProjectIcon } from './icons/ProjectIcon';
import { PropertyIcon } from './icons/PropertyIcon';
import { TenderIcon } from './icons/TenderIcon';
import { TimeIcon } from './icons/TimeIcon';
import { ToolsIcon } from './icons/ToolsIcon';
import { Notifications } from './notifications/Notifications';
import { OrganizationSwitcher } from './organizations/OrganizationSwitcher';

interface PageProps {
	children: React.ReactNode;
	title?: string;
	breadcrumbs?: {
		title: string;
		url?: string;
	}[];
	backgroundColor?: string;
	actions?: React.ReactNode;
	contentPadding?: boolean;
	onLinkClick?: () => void;
	extraNav?: React.ReactNode;
}

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

export const Page = ({
	title,
	breadcrumbs,
	children,
	backgroundColor,
	contentPadding = true,
	actions,
	extraNav = null,
	onLinkClick
}: PageProps): JSX.Element | null => {
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
				</VStack>

				<Text fontSize="xs" color="gray.700" userSelect="none">
					v1.8
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
										<MenuItem
											onClick={async () => {
												await firebase.signOut();
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

				{/* Page Header */}
				<Box
					as="header"
					borderBottom="1px solid"
					borderColor="gray.200"
					boxShadow="6px 6px 25px rgba(0, 0, 0, 0.03)"
					py={3}
					px={4}
					bg="white"
				>
					<Flex justifyContent="space-between" alignItems="center">
						<Box>
							{breadcrumbs ? (
								<Breadcrumb
									spacing="8px"
									separator={
										<Chevron direction="right" color={Theme.colors.green} />
									}
								>
									{breadcrumbs.map((breadcrumb, bIndex) => (
										<BreadcrumbItem key={bIndex}>
											<BreadcrumbLink as={Link} to={breadcrumb.url || ''}>
												{breadcrumb.title}
											</BreadcrumbLink>
										</BreadcrumbItem>
									))}
								</Breadcrumb>
							) : (
								<Text color="black">{title}</Text>
							)}
						</Box>
						<HStack spacing={2}>{actions}</HStack>
					</Flex>
				</Box>

				{extraNav}

				{/* Page Content */}
				<Box
					flex={1}
					maxHeight="100%"
					maxWidth="100%"
					overflowX="hidden"
					overflowY="auto"
					bg={backgroundColor}
					p={contentPadding ? { base: 4, md: 4 } : 0}
				>
					<Fade in={true} style={{ flex: 1, height: '100%' }}>
						{children}
					</Fade>
				</Box>
			</Flex>
			<DevMenu />
		</Flex>
	);
};
