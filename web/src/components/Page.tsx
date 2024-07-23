import {
	Avatar,
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Center,
	Fade,
	Flex,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList,
	Text
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
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
// import { OrganizationSwitcher } from './organizations/OrganizationSwitcher';
// import { ManageOrganization } from './organizations/ManageOrganization';

interface PageProps {
	children: React.ReactNode;
	title?: string;
	breadcrumbs?: {
		title: string;
		url?: string;
	}[];
	tabs?: React.ReactNode;
	backgroundColor?: string;
	actions?: React.ReactNode;
	contentPadding?: boolean;
	onLinkClick?: () => void;
	extraNav?: React.ReactNode;
}

const PageStyled = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: row;
	overflow-y: hidden;
	overflow-x: hidden;
`;

const Sidebar = styled.div`
	background: #000;
	flex: 0 1 240px;
	padding: ${(props) => props.theme.padding(2)};
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;

	small {
		color: #333;
		user-select: none;
	}
`;

const PageWrapper = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	background: ${(props) => props.theme.colors.blueBackground};
	max-width: calc(100vw - 80px);
`;

const PageContent = styled.div<Pick<PageProps, 'contentPadding' | 'backgroundColor'>>`
	flex: 1;
	max-height: 100%;
	max-width: 100%;
	overflow-x: hidden;
	overflow-y: auto;

	${(props) =>
		props.backgroundColor &&
		css`
			background-color: ${props.backgroundColor};
		`};

	${(props) =>
		props.contentPadding &&
		css`
			padding: ${props.theme.padding(1)};

			@media screen and (max-width: 768px) {
				padding: ${props.theme.padding(1)};
			}
		`};
`;

const PageHeader = styled.header`
	border-bottom: 1px solid ${(props) => props.theme.colors.border};
	box-shadow: 6px 6px 25px rgba(0, 0, 0, 0.03);
	padding: 12px 16px;
	background: #fff;

	> div:first-child {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h3 {
		user-select: none;
		margin: 0;
		display: flex;
		align-items: center;

		span {
			&:not(:last-child):after {
				content: '»';
				color: ${(props) => props.theme.colors.green};
				margin: 0 8px;
			}
		}
	}

	> * {
		flex: 1 1 0;

		&:first-child {
			justify-content: flex-start;
		}

		&:last-child {
			justify-content: flex-end;
		}
	}
`;

const HeaderActions = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;

	> *:not(:last-child) {
		margin-right: 8px;
	}
`;

const SidebarNav = styled.nav`
	display: flex;
	flex-direction: column;
`;

const IconLink = styled(NavLink)`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin: 8px;
	font-weight: bold;
	color: #8d8d8d;

	> div:first-child {
		margin: 4px 12px 4px 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background: transparent;
		transition: all 0.2s linear;

		svg {
			path {
				transition: all 0.2s linear;
			}
		}
	}

	&.active {
		color: ${(props) => props.theme.colors.yellow};

		> div {
			svg {
				path {
					fill: ${(props) => props.theme.colors.yellow};
				}
			}
		}
	}
`;

export const Page = ({
	title,
	breadcrumbs,
	tabs,
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
	const [showSearch, setShowSearch] = useState(false);

	if (user === null) {
		return null;
	}

	return (
		<PageStyled>
			<Sidebar>
				<Link to={'/'} onClick={onLinkClick}>
					<GigoverLogo scale={0.7} />
				</Link>
				<SidebarNav>
					<IconLink to={'/'} end={true} onClick={onLinkClick}>
						<div>
							<ProjectIcon />
						</div>
						<span>Projects</span>
					</IconLink>
					<IconLink onClick={onLinkClick} to={'/property'}>
						<div>
							<PropertyIcon />
						</div>
						<span>Properties</span>
					</IconLink>
					{/* <IconLink onClick={onLinkClick} to={'/roadmap'}>
						<div>
							<RoadmapIcon />
						</div>
						<span>Gantt chart*</span>
					</IconLink> */}
					<IconLink onClick={onLinkClick} to={'/files'}>
						<div>
							<FolderIcon color={Theme.colors.white} type={'bold'} />
						</div>
						<span>File storage</span>
					</IconLink>
					<IconLink onClick={onLinkClick} to={'/resources'}>
						<div>
							<ToolsIcon color={Theme.colors.white} type={'bold'} />
						</div>
						<span>Resources</span>
					</IconLink>
					<IconLink onClick={onLinkClick} to={'/time-tracker'}>
						<div>
							<TimeIcon />
						</div>
						<span>Reports</span>
					</IconLink>
					<IconLink onClick={onLinkClick} to={'/tender'}>
						<div>
							<TenderIcon />
						</div>
						<span>Tenders</span>
					</IconLink>
					{/* <IconLink onClick={onLinkClick} to={'/settings'}>
						<div>
							<SettingsIcon />
						</div>
						<span>Settings*</span>
					</IconLink> */}
				</SidebarNav>

				{/* <Flex
					flexDirection={'column'}
					width={'full'}
					justifySelf={'flex-end'}
					py={2}
					height={28}
				>
					<Box>
						<OrganizationSwitcher />
					</Box>
					<Spacer />
					<Box>
						<ManageOrganization />
					</Box>
				</Flex> */}
				<small>v1.8</small>
			</Sidebar>
			<PageWrapper>
				<Box p={2} backgroundColor={'white'} borderBottom={'1px'} borderColor={'gray.300'}>
					<Flex justifyContent={'end'}>
						<Flex pr={3}>
							<OrganizationSwitcher />
							<Notifications />
							<Menu>
								<MenuButton ml={2}>
									<Avatar size={'sm'} name={user.email} src={user.avatar} />
								</MenuButton>
								<MenuList>
									<MenuGroup title="Profile">
										{/* <NavLink to={'/settings'}>
											<MenuItem>Settings</MenuItem>
										</NavLink> */}
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
				<PageHeader>
					<div>
						<div>
							{breadcrumbs ? (
								<Breadcrumb
									spacing={'8px'}
									separator={
										<Chevron direction={'right'} color={Theme.colors.green} />
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
								<Text textColor={'black'}>{title}</Text>
							)}
						</div>
						<HeaderActions>{actions}</HeaderActions>
					</div>
					{tabs && (
						<Box mt={2}>
							<Center>
								<div>{tabs}</div>
							</Center>
						</Box>
					)}
				</PageHeader>
				{extraNav}
				<PageContent contentPadding={contentPadding} backgroundColor={backgroundColor}>
					<Fade in={true} style={{ flex: 1, height: '100%' }}>
						{children}
					</Fade>
				</PageContent>
			</PageWrapper>
			<DevMenu />
		</PageStyled>
	);
};
