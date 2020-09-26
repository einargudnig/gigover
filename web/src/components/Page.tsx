import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';
import { GoIcon } from './GoIcon';
import { Link, NavLink } from 'react-router-dom';
import { ProjectIcon } from './icons/ProjectIcon';
import { OrganizeIcon } from './icons/OrganizeIcon';
import { TimeIcon } from './icons/TimeIcon';
import { UsersIcon } from './icons/UsersIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { ModalContext } from '../context/ModalContext';
import { Button } from './forms/Button';
import { PlusIcon } from './icons/PlusIcon';
import { ClockIcon } from './icons/ClockIcon';

interface PageProps {
	children: React.ReactNode;
	title?: string;
	breadcrumbs?: string[];
	tabs?: React.ReactNode;
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

	header {
		box-shadow: 6px 6px 25px rgba(0, 0, 0, 0.03);
		display: flex;
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
	}
`;

const PageContent = styled.div`
	flex: 1;
	padding: ${(props) => props.theme.padding(3)};
	max-height: 100%;
	max-width: 100%;
	overflow-x: hidden;
	overflow-y: auto;

	@media screen and (max-width: 768px) {
		padding: ${(props) => props.theme.padding(2)};
	}
`;

const HeaderActions = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;

	> *:not(:last-child) {
		margin-right: 24px;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
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

export const Page = ({ title, breadcrumbs, tabs, children }: PageProps): JSX.Element | null => {
	const user = useContext(UserContext);
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
					<IconLink to={'/organize'}>
						<div>
							<OrganizeIcon />
						</div>
					</IconLink>
					<IconLink to={'/time-tracker'}>
						<div>
							<TimeIcon />
						</div>
					</IconLink>
					<IconLink to={'/users'}>
						<div>
							<UsersIcon />
						</div>
					</IconLink>
					<IconLink to={'/settings'}>
						<div>
							<SettingsIcon />
						</div>
					</IconLink>
				</SidebarNav>
				<small>v1.0</small>
			</Sidebar>
			<PageWrapper>
				<header>
					<h3>
						{breadcrumbs ? (
							<>
								{breadcrumbs.map((breadcrumb, bIndex) => (
									<span key={bIndex}>{breadcrumb}</span>
								))}
							</>
						) : (
							title || ''
						)}
					</h3>
					{tabs && <div>{tabs}</div>}
					<HeaderActions>
						<Button size={'small'} appearance={'outline'} height={'38px'}>
							<ClockIcon />
						</Button>
						<Button
							size={'small'}
							appearance={'outline'}
							height={'38px'}
							onClick={() =>
								setModalContext({ modifyProject: { project: undefined } })
							}
						>
							<PlusIcon />
						</Button>
						<div className={'avatar'}>
							<img src={user.avatar} alt={'Avatar'} />
						</div>
					</HeaderActions>
				</header>
				<PageContent>{children}</PageContent>
			</PageWrapper>
		</PageStyled>
	);
};
