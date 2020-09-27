import React from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';

type ButtonSize = 'fill' | 'large' | 'normal' | 'small' | 'tiny' | 'none';
type ButtonAppearance = 'primary' | 'green' | 'lightblue' | 'outline' | 'delete';

const getButtonStyle = (appearance: ButtonAppearance) => {
	switch (appearance) {
		case 'delete':
			return css`
				color: ${(props) => props.theme.colors.red};
				background: transparent;
				border: none;
				box-shadow: none;
				border-radius: 0;

				&:hover {
					color: ${(props) => props.theme.colors.red};
					background: transparent;
					border: none;
					box-shadow: none;
					text-decoration: underline;
				}

				&:focus {
					text-decoration: underline;
					border: none;
					outline: none;
				}
			`;
		case 'outline':
			return css`
				color: ${(props) => props.theme.colors.darkLightBlue};
				background: transparent;
				border-color: ${(props) => props.theme.colors.border};
			`;
		case 'lightblue':
			return css`
				background-color: #f4f7fc;
				color: #b0bddc;
				justify-content: flex-start;
				outline: none;
				border: none;

				svg {
					path {
						fill: #b0bddc;
					}
				}

				&:active,
				&:focus {
					border: none;
				}

				&:hover {
					color: ${darken(0.1, '#b0bddc')};
					background-color: ${darken(0.1, '#f4f7fc')};
					svg {
						path {
							fill: ${darken(0.1, '#b0bddc')};
						}
					}
				}
			`;
	}

	return null;
};

const getButtonSized = (size: ButtonSize) => {
	switch (size) {
		case 'fill':
			return css`
				width: 100%;
				border-radius: 6px;
				padding: 12px 12px;
			`;
		case 'large':
			return css`
				padding: 12px 40px;
			`;
		case 'small':
			return css`
				padding: 12px 12px;
			`;
		case 'tiny':
			return css`
				padding: 6px 10px;
				font-size: 11px;
`;
		case 'none':
			return css`
				padding: 0;
			`;
	}

	return null;
};

const StyledButton = styled.button<{
	appearance: ButtonAppearance;
	disabled: boolean;
	height: string;
	size: ButtonSize;
}>`
	background: #000;
	border-radius: 24px;
	padding: 12px 30px;
	color: #fff;
	cursor: pointer;
	font-weight: bold;
	outline: none;
	height: ${(props) => props.height};
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.2s linear;
	transform: scale(1);
	box-shadow: none;
	border: 2px solid #000;

	&:active {
		transform: scale(0.95);
	}

	&:hover {
		box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
		background-color: ${(props) => props.theme.colors.green};
		border-color: #1ed07a;
		color: ${(props) => props.theme.colors.darkGreen};
	}

	&:focus {
		border: 2px solid ${(props) => props.theme.colors.green};
	}

	${(props) => props.appearance !== 'primary' && getButtonStyle(props.appearance)}
	${(props) => props.size !== 'normal' && getButtonSized(props.size)}

	${(props) =>
		props.disabled &&
		css`
			pointer-events: none;
		`}
`;

interface ButtonProps {
	children: React.ReactNode;
	appearance?: ButtonAppearance;
	type?: 'submit' | 'button';
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	loading?: boolean;
	height?: string;
	size?: ButtonSize;
}

export const Button = ({
	children,
	appearance = 'primary',
	size = 'normal',
	type,
	onClick,
	disabled = false,
	loading = false,
	height = 'auto',
	...props
}: ButtonProps): JSX.Element => {
	return (
		<StyledButton
			size={size}
			appearance={appearance}
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
			height={height}
			{...props}
		>
			{loading ? <p>Loading</p> : children}
		</StyledButton>
	);
};
