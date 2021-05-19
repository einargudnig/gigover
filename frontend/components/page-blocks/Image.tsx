import React from 'react';
import { PageId } from '../../models/Page';
import { PageBlock } from '../../models/PageBlock';
import { Div } from '../Div';
import theme from '../../styles/theme';
import styled from 'styled-components';

interface ImageProps {
	pageId: PageId;
	pageBlock: PageBlock;
}

const ImageContainer = styled(Div)`
	h2 {
		margin-bottom: ${props => props.theme.padding(3)};
	}

	p {
		font-size: 18px;
		font-weight: 300;
		margin-bottom: ${props => props.theme.padding(6)};
	}
	
	img {
		max-width: 100%;
	}
`;

export const Image = ({ pageId, pageBlock }: ImageProps): JSX.Element => {
	return (
		<ImageContainer flex={'column'} justify={'center'} align={'center'} style={{ padding: theme.padding(8, 0) }}>
			<h2>{pageBlock.heading}</h2>
			<p>{pageBlock.content}</p>
			<img src={pageBlock.image.url} />
		</ImageContainer>
	);
};
