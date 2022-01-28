import React from 'react';
import styled, {css} from 'styled-components';
import { PageBlock } from '../../models/PageBlock';
import { Div } from '../Div';
import ReactMarkdown from 'react-markdown';
import theme from '../../styles/theme';
import { PageId } from '../../models/Page';
import { Button } from '../Button';
import { GoogleIconProps } from '../icons/GoogleIcon';
import { useVerify } from '../../queries/useVerify';
import Link from 'next/link';

interface HeroProps {
	pageId: PageId;
	pageBlock: PageBlock;
	centerText?: boolean;
}

const HeroImage = styled.div`
	flex: 0 0 35%;
	margin-left: ${theme.padding(6)};

	img {
		max-width: 100%;
		user-select: none;
	}
	
	@media screen and (max-width: 768px) {
		display: none;
	}
`;

const HeroContent = styled.div<{ centerText: boolean }>`
	h1 {
		margin-bottom: ${theme.padding(3)};
	}

	p {
		font-size: 18px;
		line-height: 1.6;
		font-weight: 300;
	}
	
	${props => props.centerText && css`
		h1 {
			text-align: center;
		}
		
		p {
			text-align: center;
		}
	`};
	
	@media screen and (max-width: 924px) {
		p {
			font-size: 16px;
		}
	}
	
	@media screen and (max-width: 768px) {		
		p {
			font-size: 14px;
		}
	}
`;

const CallToActionWrapper = styled(Div)`
	margin-top: ${theme.padding(3)};

	> *:not(:first-child) {
		margin-left: ${theme.padding(2)};
	}
`;

export const Hero = ({ pageId, pageBlock, centerText = false }: HeroProps): JSX.Element => {
	const { authenticated, openProjects } = useVerify();

	const CallToAction = () => {
		if (pageId === PageId.Frontpage) {
			return (
				<CallToActionWrapper flex align={'center'} justify={'flex-start'}>
					<Button
						color={'white'}
						onClick={() => {
							openProjects();
						}}
					>
						{authenticated ? (
							<span>View your projects</span>
						) : (
							<Div flex align={'center'} justify={'flex-start'}>
								<GoogleIconProps
									style={{ marginLeft: -12, marginTop: -10, marginBottom: -10 }}
								/>
								<span style={{ marginLeft: theme.padding(1) }}>
									Sign up with Google
								</span>
							</Div>
						)}
					</Button>
					<Link href={'/features'}>
						<a className={'normal'}>
							<Button>View features</Button>
						</a>
					</Link>
				</CallToActionWrapper>
			);
		}

		return <div />;
	};

	return (
		<Div
			flex
			justify={centerText ? 'center' : 'space-between'}
			align={'center'}
			style={{ paddingBottom: theme.padding(4) }}
		>
			<HeroContent centerText={centerText}>
				<h1>{pageBlock.heading}</h1>
				<ReactMarkdown>{pageBlock.content}</ReactMarkdown>
				<CallToAction />
			</HeroContent>
			{pageBlock.image && (
				<HeroImage>
					<img src={pageBlock.image.url} alt={pageBlock.image.fileName} />
				</HeroImage>
			)}
		</Div>
	);
};
