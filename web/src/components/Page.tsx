import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { UserContext } from '../context/UserContext';
import { GoIcon } from './GoIcon';
import { Link, NavLink } from 'react-router-dom';
import { ProjectIcon } from './icons/ProjectIcon';
import { TimeIcon } from './icons/TimeIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { ModalContext } from '../context/ModalContext';
import { PlusIcon } from './icons/PlusIcon';
import { ClockIcon } from './icons/ClockIcon';
import {
	Avatar,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Center,
	Fade,
	Heading,
	IconButton,
	Menu,
	MenuButton,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuList
} from '@chakra-ui/react';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { RoadmapIcon } from './icons/RoadmapIcon';
import { Chevron } from './icons/Chevron';
import { Theme } from '../Theme';

interface PageProps {
	children: React.ReactNode;
	title?: string;
	breadcrumbs?: string[];
	tabs?: React.ReactNode;
	backgroundColor?: string;
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
	flex: 0 1 80px;
	padding: 24px 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

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

const PageContent = styled.div<{ backgroundColor?: string }>`
	flex: 1;
	padding: ${(props) => props.theme.padding(3)};
	max-height: 100%;
	max-width: 100%;
	overflow-x: hidden;
	overflow-y: auto;

	${(props) =>
		props.backgroundColor &&
		css`
			background-color: ${props.backgroundColor};
		`};

	@media screen and (max-width: 768px) {
		padding: ${(props) => props.theme.padding(2)};
	}
`;

const PageHeader = styled.header`
	display: flex;
	box-shadow: 6px 6px 25px rgba(0, 0, 0, 0.03);
	justify-content: space-between;
	align-items: center;
	padding: 12px 16px;
	background: #fff;
	border-bottom: 1px solid ${(props) => props.theme.colors.border};

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
		margin-right: 24px;
	}
`;

const SidebarNav = styled.nav`
	display: flex;
	flex-direction: column;
`;

const IconLink = styled(NavLink)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 8px;

	> div {
		margin: 4px;
		height: 60px;
		width: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
	}

	&.active {
		> div {
			background: ${(props) => props.theme.colors.green};
		}
	}
`;

export const Page = ({
	title,
	breadcrumbs,
	tabs,
	children,
	backgroundColor
}: PageProps): JSX.Element | null => {
	const user = useContext(UserContext);
	const firebase = useContext(FirebaseContext);
	const [, setModalContext] = useContext(ModalContext);

	if (user === null) {
		return null;
	}

	return (
		<PageStyled>
			<Sidebar>
				<Link to={'/'}>
					<GoIcon size={40} />
				</Link>
				<SidebarNav>
					<IconLink to={'/'} end={true}>
						<div>
							<ProjectIcon />
						</div>
					</IconLink>
					{/*<IconLink to={'/organize'}>*/}
					{/*	<div>*/}
					{/*		<OrganizeIcon />*/}
					{/*	</div>*/}
					{/*</IconLink>*/}
					<IconLink to={'/roadmap'}>
						<div>
							<RoadmapIcon />
						</div>
					</IconLink>
					<IconLink to={'/time-tracker'}>
						<div>
							<TimeIcon />
						</div>
					</IconLink>
					{/*<IconLink to={'/users'}>
						<div>
							<UsersIcon />
						</div>
					</IconLink>*/}
					<IconLink to={'/settings'}>
						<div>
							<SettingsIcon />
						</div>
					</IconLink>
				</SidebarNav>
				<small>v1.1</small>
			</Sidebar>
			<PageWrapper>
				<PageHeader>
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
										<BreadcrumbLink href={'#'}>{breadcrumb}</BreadcrumbLink>
									</BreadcrumbItem>
								))}
							</Breadcrumb>
						) : (
							<Heading size={'md'}>{title}</Heading>
						)}
					</div>
					{tabs && (
						<Center>
							<div>{tabs}</div>
						</Center>
					)}
					<HeaderActions>
						<IconButton
							variant={'outline'}
							colorScheme={'gray'}
							aria-label={'Track time'}
							onClick={() => {
								setModalContext({
									timeTracker: {
										project: undefined,
										task: undefined
									}
								});
							}}
							icon={<ClockIcon />}
						/>
						<IconButton
							variant={'outline'}
							colorScheme={'gray'}
							aria-label={'New project'}
							onClick={() => {
								setModalContext({ modifyProject: { project: undefined } });
							}}
							icon={<PlusIcon />}
						/>
						<div>
							<Menu>
								<MenuButton>
									<Avatar size={'md'} name={user.email} src={user.avatar} />
								</MenuButton>
								<MenuList>
									<MenuGroup title="Profile">
										<NavLink to={'/settings'}>
											<MenuItem>Settings</MenuItem>
										</NavLink>
										<MenuItem onClick={() => firebase.signOut()}>
											Sign out
										</MenuItem>
									</MenuGroup>
									<MenuDivider />
									<MenuGroup title="Help">
										<MenuItem>Helpdesk</MenuItem>
										<MenuItem>FAQ</MenuItem>
									</MenuGroup>
								</MenuList>
							</Menu>
						</div>
					</HeaderActions>
				</PageHeader>
				<PageContent backgroundColor={backgroundColor}>
					<Fade in={true} style={{ flex: 1, height: '100%' }}>
						{children}
					</Fade>
				</PageContent>
			</PageWrapper>
		</PageStyled>
	);
};
