import React from 'react';
import { PageId } from '../../models/Page';
import { PageBlock } from '../../models/PageBlock';
import { Div } from '../Div';
import ReactMarkdown from 'react-markdown';
import { FeatureCard } from '../FeatureCard';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { Button } from '../Button';

const FeatureIconsContainer = styled.div`
	display: flex;
	flex: 0 0 45%;
	flex-wrap: wrap;

	> * {
		flex: 0 0 240px;
		margin: 16px;

		&:nth-child(2) {
			margin-top: 44px;
		}

		&:nth-child(4) {
			margin-top: 22px;
			margin-bottom: -22px;
		}
	}
`;

const FeaturesContainer = styled.div`
	h2 {
		line-height: 48px;
		margin-bottom: ${(props) => props.theme.padding(3)};
	}

	p {
		font-size: 18px;
		line-height: 24px;
		font-weight: 300;
	}
`;

const FeaturesLabel = styled.div`
	display: inline-block;
	color: ${(props) => props.theme.colors.yellow['500']};
	background-color: ${(props) => props.theme.colors.yellow['100']};
	font-weight: 800;
	font-size: 25px;
	padding: ${(props) => props.theme.padding(1.5, 3)};
	margin-bottom: ${(props) => props.theme.padding(3)};
	border-radius: ${(props) => props.theme.borderRadius};
`;

interface FeaturesProps {
	pageId: PageId;
	pageBlock: PageBlock;
}

export const Features = ({ pageBlock }: FeaturesProps): JSX.Element => (
	<Div
		flex
		justify={'space-between'}
		align={'center'}
		style={{ padding: theme.padding(6, 0), paddingBottom: theme.padding(10) }}
	>
		<FeatureIconsContainer>
			{pageBlock.features.map((feature, featureIndex) => (
				<FeatureCard feature={feature} key={featureIndex} />
			))}
		</FeatureIconsContainer>
		<FeaturesContainer>
			<FeaturesLabel>Features</FeaturesLabel>
			<h2>{pageBlock.heading}</h2>
			<ReactMarkdown>{pageBlock.content}</ReactMarkdown>
			<div style={{ height: theme.padding(3) }} />
			<Button>Get started</Button>
		</FeaturesContainer>
	</Div>
);
