import React from 'react';
import styled, { css } from 'styled-components';

type ButtonSize = 'large' | 'normal' | 'small';
type ButtonAppearance = 'primary' | 'green' | 'outline';

const getButtonStyle = (appearance: ButtonAppearance) => {
	switch (appearance) {
		case 'primary':
			return null;
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
	onClick?: () => void;
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
	height = 'auto'
}: ButtonProps): JSX.Element => {
	return (
		<StyledButton
			size={size}
			appearance={appearance}
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
			height={height}
		>
			{loading ? <p>Loading</p> : children}
		</StyledButton>
	);
};
