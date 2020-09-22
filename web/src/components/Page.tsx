import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';
import { GoIcon } from './GoIcon';
import { Link } from 'react-router-dom';
import { ProjectIcon } from './icons/ProjectIcon';
import { OrganizeIcon } from './icons/OrganizeIcon';

interface PageProps {
	title?: string;
	headerActions?: React.ReactNode;
	children: React.ReactNode;
}

const PageStyled = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
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

		h3 {
			margin: 0;
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
	}

	.page-content {
		padding: 20px 40px;
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

export const Page = ({ title, headerActions, children }: PageProps): JSX.Element | null => {
	const user = useContext(UserContext);

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
					<IconLink to={'/'}>
						<OrganizeIcon />
					</IconLink>
				</SidebarNav>
				<small>v1.0</small>
			</Sidebar>
			<PageWrapper>
				<header>
					<h3>{title ? title : ''}</h3>
					{headerActions && <div>{headerActions}</div>}
					<div className={'avatar'}>
						<img src={user.avatar} alt={'Avatar'} />
					</div>
				</header>
				<div className={'page-content'}>{children}</div>
			</PageWrapper>
		</PageStyled>
	);
};
