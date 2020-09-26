import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';
import { GoIcon } from './GoIcon';
import { Link } from 'react-router-dom';
import { ProjectIcon } from './icons/ProjectIcon';
import { OrganizeIcon } from './icons/OrganizeIcon';
import { TimeIcon } from './icons/TimeIcon';
import { UsersIcon } from './icons/UsersIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { ModalContext } from '../context/ModalContext';

interface PageProps {
	title?: string;
	tabs?: React.ReactNode;
	children: React.ReactNode;
}

const PageStyled = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	overflow-y: hidden;
`;

const Sidebar = styled.div`
	background: #000;
	flex: 0 0 80px;
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
	background: #f4f7fc;

	header {
		width: 100%;
		box-shadow: 6px 6px 25px rgba(0, 0, 0, 0.03);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		background: #fff;

		h3 {
			margin: 0;
		}
	}

	.page-content {
		padding: 20px 40px 80px 40px;
		max-height: 100%;
		overflow-y: scroll;
	}
`;

const HeaderActions = styled.div`
	display: flex;
	justify-content: flex-start;

	> *:not(:last-child) {
		margin-right: 8px;
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

const IconLink = styled(Link)`
	display: block;
	padding: 24px;
	margin: 8px;
`;

export const Page = ({ title, tabs, children }: PageProps): JSX.Element | null => {
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
					<IconLink to={'/'}>
						<ProjectIcon />
					</IconLink>
					<IconLink to={'/organize'}>
						<OrganizeIcon />
					</IconLink>
					<IconLink to={'/time-tracker'}>
						<TimeIcon />
					</IconLink>
					<IconLink to={'/users'}>
						<UsersIcon />
					</IconLink>
					<IconLink to={'/settings'}>
						<SettingsIcon />
					</IconLink>
				</SidebarNav>
				<small>v1.0</small>
			</Sidebar>
			<PageWrapper>
				<header>
					<h3>{title ? title : ''}</h3>
					{tabs && <div>{tabs}</div>}
					<HeaderActions>
						<button>Time</button>
						<button
							onClick={() =>
								setModalContext({ modifyProject: { project: undefined } })
							}
						>
							New
						</button>
						<div className={'avatar'}>
							<img src={user.avatar} alt={'Avatar'} />
						</div>
					</HeaderActions>
				</header>
				<div className={'page-content'}>{children}</div>
			</PageWrapper>
		</PageStyled>
	);
};
