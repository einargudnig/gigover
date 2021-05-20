import React from 'react';
import { PageBlock } from './PageContainer';
import Link from 'next/link';
import { Logo } from './Logo';
import { Div } from './Div';
import { StyledNavigation } from './Navigation';
import { Page } from '../models/Page';
import theme from '../styles/theme';
import {FacebookIcon} from './icons/FacebookIcon';
import {TwitterIcon} from './icons/TwitterIcon';
import {LinkedInIcon} from './icons/LinkedInIcon';

interface FooterProps {
	pages: Page[];
}

export const Footer = ({ pages }: FooterProps): JSX.Element => {
	const navigationPages = pages.filter((p) => p.inNavigation);

	return (
		<PageBlock color={'black'}>
			<div style={{ padding: theme.padding(8, 0) }}>
				<Div
					flex
					justify={'space-between'}
					align={'center'}

				>
					<Link href={'/'}>
						<a className={'normal'}>
							<Logo color={'white'} />
						</a>
					</Link>
					<StyledNavigation flex justify={'flex-start'} align={'center'}>
						<nav>
							{navigationPages.map((p) => (
								<Link href={`/${p.slug}`} key={p.id}>
									<a>{p.name}</a>
								</Link>
							))}
						</nav>
					</StyledNavigation>
				</Div>
				<div style={{ height: theme.padding(6) }} />
				<Div
					flex
					justify={'space-between'}
					align={'center'}
				>
					<div>
						<p style={{ fontSize: 18, fontWeight: '300', paddingBottom: theme.padding(1) }}>Copyright © {new Date().getFullYear()}</p>
						<p style={{ fontSize: 14, fontWeight: 'bold' }}>Project management made easy</p>
					</div>
					<Div flex justify={'flex-end'} align={'center'}>
						<a href={'https://www.facebook.com/Gigover-256781578114736'} className={'normal'} target={'_blank'} rel={'noopener noreferrer'}>
							<FacebookIcon />
						</a>
						<div style={{ width: theme.padding(2) }} />
						<a href={'https://twitter.com/GigOver'} className={'normal'} target={'_blank'} rel={'noopener noreferrer'}>
							<TwitterIcon />
						</a>
						<div style={{ width: theme.padding(2) }} />
						<a href={'https://www.linkedin.com/company/gigover'} className={'normal'} target={'_blank'} rel={'noopener noreferrer'}>
							<LinkedInIcon />
						</a>
					</Div>
				</Div>
			</div>
		</PageBlock>
	);
};
