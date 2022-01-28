import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Div } from './Div';
import styled from 'styled-components';
import { PageBlock } from './PageContainer';
import { Button } from './Button';
import { useVerify } from '../queries/useVerify';
import { Page } from '../models/Page';
import { MobileNavigation } from './MobileNavigation';

interface NavigationProps {
	pages: Page[];
}

export const StyledNavigation = styled(Div)`
	a {
		background-size: 0 0;
	}

	nav {
		a {
			font-weight: bold;
			color: inherit;
			text-decoration: none;
			background-size: 0 0;
			margin-left: ${(props) => props.theme.padding(3.5)};
			transition: all 0.2s linear;
			padding: 6px;

			&:hover {
				color: #000;
				background-size: 4px 50px;
			}
		}
	}

	@media screen and (max-width: 924px) {
		nav {
			a {
				margin-left: ${(props) => props.theme.padding(3)};
			}
		}
	}

	@media screen and (max-width: 768px) {
		nav {
			display: none;
		}
	}
`;

const Burger = styled.div`
	display: none;

	@media screen and (max-width: 768px) {
		margin-left: ${(props) => props.theme.padding(2)};
		display: block;
	}
`;

export const Nav = ({ pages }: { pages: Page[] }): JSX.Element => (
	<>
		{pages.map((p) => (
			<Link href={`/${p.slug}`} key={p.id}>
				<a>{p.name}</a>
			</Link>
		))}
	</>
);

export const Navigation = ({ pages }: NavigationProps): JSX.Element => {
	const [showDrawer, setShowDrawer] = useState(false);
	const { authenticated, isLoading, openProjects } = useVerify();
	const navigationPages = pages.filter((p) => p.inNavigation);

	return (
		<PageBlock color={'black'}>
			<Div flex justify={'space-between'} align={'center'}>
				<StyledNavigation flex justify={'flex-start'} align={'center'}>
					<Link href={'/'}>
						<a>
							<Logo color={'white'} />
						</a>
					</Link>
					<nav role={'main'}>
						<Nav pages={navigationPages} />
					</nav>
				</StyledNavigation>
				{!isLoading && (
					<Div flex justify={'flex-end'} align={'center'}>
						<Button
							color={'white'}
							onClick={() => {
								openProjects();
							}}
						>
							{authenticated ? <span>Your projects</span> : <span>Sign up</span>}
						</Button>
						<Burger onClick={() => setShowDrawer(true)}>
							<svg
								width="30"
								height="23"
								viewBox="0 0 30 23"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0 1.5C0 0.671573 0.671573 0 1.5 0H28.5C29.3284 0 30 0.671573 30 1.5C30 2.32843 29.3284 3 28.5 3H1.5C0.671573 3 0 2.32843 0 1.5ZM0 11.5C0 10.6716 0.671573 10 1.5 10H28.5C29.3284 10 30 10.6716 30 11.5C30 12.3284 29.3284 13 28.5 13H1.5C0.671573 13 0 12.3284 0 11.5ZM1.5 20C0.671573 20 0 20.6716 0 21.5C0 22.3284 0.671573 23 1.5 23H28.5C29.3284 23 30 22.3284 30 21.5C30 20.6716 29.3284 20 28.5 20H1.5Z"
									fill="white"
								/>
							</svg>
						</Burger>
					</Div>
				)}
			</Div>
			{showDrawer && (
				<MobileNavigation pages={navigationPages} onClose={() => setShowDrawer(false)} />
			)}
		</PageBlock>
	);
};
