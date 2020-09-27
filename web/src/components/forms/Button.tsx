import React from 'react';
import styled, { css } from 'styled-components';

type ButtonSize = 'large' | 'normal' | 'small' | 'none';
type ButtonAppearance = 'primary' | 'green' | 'outline' | 'delete';

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
	}

	return null;
};

const getButtonSized = (size: ButtonSize) => {
	switch (size) {
		case 'large':
			return css`
				padding: 12px 40px;
			`;
		case 'small':
			return css`
				padding: 12px 12px;
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
