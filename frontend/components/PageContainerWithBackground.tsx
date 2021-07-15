import React from 'react';
import styled from 'styled-components';
import { ColorKey } from '../styles/theme';

interface PageBlockWithBackgroundProps {
	imageUrl: string;
	children?: React.ReactNode;
}

export const ColorContainer = styled.div<{ backgroundColor: ColorKey }>`
	color: ${({ theme, backgroundColor }) => theme.fontColors.bg[backgroundColor]};
	background-color: ${({ theme, backgroundColor }) => theme.backgroundColors[backgroundColor]};
`;

const PageContainerStyled = styled(ColorContainer)`
	position: relative;
	padding: 24px;
`;

const PageBlockImage = styled.div<{ imageUrl: string }>`
	position: absolute;
	width: 100%;
	right: 0;
	top: 0;
  	z-index: 1;
	height: 100%;

	.img {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		width: 40%;
		z-index: 1;
		opacity: 0.5;
		background-image: url(${(props) => props.imageUrl});
		background-position: 50% 25%;
		background-size: cover;
		background-repeat: no-repeat;
	}

	&:before {
		background: rgb(250, 228, 77);
		background: linear-gradient(90deg, rgba(250, 228, 77, 1) 0%, rgba(250, 228, 77, 0) 100%);
		width: 40%;
	  	opacity: 0.7;
		z-index: 2;
		position: absolute;
		content: '';
		display: block;
		height: 100%;
		top: 0;
		right: 0;
	}
`;

const Container = styled.div`
	position: relative;
	z-index: 3;
	max-width: 1343px;
	margin: 0 auto;
`;

export const PageBlockWithBackground = ({
	imageUrl,
	children
}: PageBlockWithBackgroundProps): JSX.Element => (
	<PageContainerStyled backgroundColor={'yellow'}>
		<PageBlockImage imageUrl={imageUrl}>
			<div className={'img'} />
		</PageBlockImage>
		<Container>{children}</Container>
	</PageContainerStyled>
);
