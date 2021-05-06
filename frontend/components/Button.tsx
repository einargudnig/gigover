import React from 'react';
import styled from 'styled-components';
import { ColorKey } from '../styles/theme';

interface ButtonProps extends Partial<Pick<HTMLButtonElement, 'onClick' | 'type'>> {
	children?: React.ReactNode;
	color?: ColorKey;
}

const ButtonStyled = styled.button<{ backgroundColor: ColorKey }>`
	padding: ${({ theme }) => theme.padding(1.5, 3.5)};
	border-radius:  ${({ theme }) => theme.borderRadius};
	cursor: pointer;
	border: none;
	outline: none;
	color: ${({ theme, backgroundColor }) => theme.fontColors.bg[backgroundColor]};
	background-color: ${({ theme, backgroundColor }) => theme.backgroundColors[backgroundColor]};
	transform: scale(1);
	transition: all .1s linear;
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
