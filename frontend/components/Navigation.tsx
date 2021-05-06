import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Div } from './Div';
import styled from 'styled-components';
import { PageBlock } from './PageContainer';
import { Button } from './Button';
import { Page } from '../pages/_app';

interface NavigationProps {
	pages: Page[];
}

const StyledNavigation = styled(Div)`
	nav {
		a {
			font-weight: bold;
			color: inherit;
			text-decoration: none;
			background-size: 0 0;
			margin-left: ${(props) => props.theme.padding(5)};
			transition: all 0.2s linear;
			padding: 6px;

			&:hover {
				color: #000;
				background-size: 4px 50px;
			}
		}
	}
`;

export const Navigation = ({ pages }: NavigationProps): JSX.Element => {
	const navigationPages = pages.filter((p) => p.inNavigation);

	return (
		<PageBlock color={'black'}>
			<Div flex justify={'space-between'} align={'center'}>
				<StyledNavigation flex justify={'flex-start'} align={'center'}>
					<Logo color={'white'} />
					<nav>
						{navigationPages.map((p) => (
							<Link href={`/${p.slug}`} key={p.id}>
								<a>{p.name}</a>
							</Link>
						))}
					</nav>
				</StyledNavigation>
				<Button color={'white'}>Sign in</Button>
			</Div>
		</PageBlock>
	);
};
