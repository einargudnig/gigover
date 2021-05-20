import React from 'react';
import styled from 'styled-components';
import { ColorKey } from '../styles/theme';

interface ButtonProps {
	type?: 'button' | 'submit' | 'reset';
	children?: React.ReactNode;
	color?: ColorKey;
	onClick?: (event: MouseEvent) => void;
}

const ButtonStyled = styled.button<{ backgroundColor: ColorKey }>`
	padding: ${({ theme }) => theme.padding(1.5, 2.5)};
	user-select: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	cursor: pointer;
	border: none;
	outline: none;
	color: ${({ theme, backgroundColor }) => theme.fontColors.bg[backgroundColor]};
	background-color: ${({ theme, backgroundColor }) => theme.backgroundColors[backgroundColor]};
	transform: scale(1);
	transition: all 0.1s linear;
	font-weight: bold;

	&:hover {
		transform: scale(1.05);
		background-color: ${({ theme, backgroundColor }) => theme.colors[backgroundColor]['600']};
	}

	&:active {
		transform: scale(0.998);
	}
`;

export const Button = ({ color = 'yellow', children, ...props }: ButtonProps): JSX.Element => {
	return (
		<ButtonStyled backgroundColor={color} {...props}>
			{children}
		</ButtonStyled>
	);
};
