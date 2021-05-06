import React from 'react';
import styled from 'styled-components';
import { ColorKey } from '../styles/theme';

interface PageBlockProps {
	color?: ColorKey;
	children?: React.ReactNode;
}

export const ColorContainer = styled.div<{ backgroundColor: ColorKey }>`
	color: ${({ theme, backgroundColor }) => theme.fontColors.bg[backgroundColor]};
	background-color: ${({ theme, backgroundColor }) => theme.backgroundColors[backgroundColor]};
`;

const PageContainerStyled = styled(ColorContainer)`
	padding: 24px;
`;

const Container = styled.div`
	max-width: 1343px;
	margin: 0 auto;
`;

export const PageBlock = ({ children, color = 'black' }: PageBlockProps): JSX.Element => (
	<PageContainerStyled backgroundColor={color}>
		<Container>{children}</Container>
	</PageContainerStyled>
);
