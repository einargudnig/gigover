import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { UserContext } from '../context/UserContext';
import { Link, NavLink } from 'react-router-dom';
import { ProjectIcon } from './icons/ProjectIcon';
import { TimeIcon } from './icons/TimeIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { ProcurementIcon } from './icons/ProcurementIcon';
import { OfferIcon } from './icons/OfferIcon';
import { UserOfferIcon } from './icons/UserOfferIcon';

import {
	Avatar,
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Center,
	Fade,
	Flex,
	Heading,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList
} from '@chakra-ui/react';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { RoadmapIcon } from './icons/RoadmapIcon';
import { Chevron } from './icons/Chevron';
import { Theme } from '../Theme';
import { FolderIcon } from './icons/FolderIcon';
import { useLogout } from '../mutations/useLogout';
import { DevMenu } from './DevMenu';
import { GigoverLogo } from './GigoverLogo';
import { ToolsIcon } from './icons/ToolsIcon';
import { Notifications } from './notifications/Notifications';

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
			padding: ${props.theme.padding(2)};

			@media screen and (max-width: 768px) {
				padding: ${props.theme.padding(2)};
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
	onLinkClick
}: PageProps): JSX.Element | null => {
	const { mutateAsync: logout } = useLogout();
	const user = useContext(UserContext);
	const firebase = useContext(FirebaseContext);

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
					{/*<IconLink to={'/organize'}>*/}
					{/*	<div>*/}
					{/*		<OrganizeIcon />*/}
					{/*	</div>*/}
					{/*</IconLink>*/}
					<IconLink onClick={onLinkClick} to={'/roadmap'}>
						<div>
							<RoadmapIcon />
						</div>
						<span>Gantt chart</span>
					</IconLink>
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
						<span>Time reports</span>
					</IconLink>
					<IconLink onClick={onLinkClick} to={'/procurement'}>
						<div>
							<ProcurementIcon />
						</div>
						<span>Procurement</span>
					</IconLink>
					<IconLink onClick={onLinkClick} to={'/user-offers'}>
						<div>
							<OfferIcon />
						</div>
						<span>User Offers</span>
					</IconLink>
					<IconLink onClick={onLinkClick} to={'/tender-offers'}>
						<div>
							<UserOfferIcon />
						</div>
						<span>Offers for Tender</span>
					</IconLink>
					<IconLink onClick={onLinkClick} to={'/settings'}>
						<div>
							<SettingsIcon />
						</div>
						<span>Settings</span>
					</IconLink>
				</SidebarNav>
				<small>v1.4</small>
			</Sidebar>
			<PageWrapper>
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
								<Heading size={'md'}>{title}</Heading>
							)}
						</div>
						<HeaderActions>
							{actions}
							<Flex>
								<Notifications />
								<Menu>
									<MenuButton ml={2}>
										<Avatar size={'sm'} name={user.email} src={user.avatar} />
									</MenuButton>
									<MenuList>
										<MenuGroup title="Profile">
											<NavLink to={'/settings'}>
												<MenuItem>Settings</MenuItem>
											</NavLink>
											<MenuItem
												onClick={async () => {
													await firebase.signOut();
													await logout(undefined, undefined);
												}}
											>
												Sign out
											</MenuItem>
										</MenuGroup>
									</MenuList>
								</Menu>
							</Flex>
						</HeaderActions>
					</div>
					{tabs && (
						<Box mt={2}>
							<Center>
								<div>{tabs}</div>
							</Center>
						</Box>
					)}
				</PageHeader>
				<PageContent contentPadding={contentPadding} backgroundColor={backgroundColor}>
					<Fade in={true} style={{ flex: 1, height: '100%' }}>
						{children}
					</Fade>
				</PageContent>
			</PageWrapper>
			{/* <DevMenu /> */}
		</PageStyled>
	);
};
