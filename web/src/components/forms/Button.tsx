import React from 'react';
import styled, { css } from 'styled-components';

type ButtonAppearance = 'primary' | 'green';

const StyledButton = styled.button<{
	appearance: ButtonAppearance;
	disabled: boolean;
	height: string;
}>`
	background: ${(props) => props.theme.colors.green};
	border-radius: 10px;
	padding: 12px 16px;
	color: ${(props) => props.theme.colors.darkBlue};
	cursor: pointer;
	font-weight: bold;
	outline: none;
	border: none;
	height: ${(props) => props.height};
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.2s linear;
	transform: scale(1);

	&:active {
		transform: scale(0.95);
	}

	&:hover {
		background-color: #1ed07a;
	}

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
}

export const Button = ({
	children,
	appearance = 'primary',
	type,
	onClick,
	disabled = false,
	loading = false,
	height = 'auto'
}: ButtonProps): JSX.Element => {
	return (
		<StyledButton
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
