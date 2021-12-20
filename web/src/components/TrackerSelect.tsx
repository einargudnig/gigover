import React from 'react';
import styled, { css } from 'styled-components';
import { CaretIcon } from './icons/CaretIcon';
import { darken } from 'polished';

const TrackerSelectStyled = styled.div<{ minWidth?: number; margin: number }>`
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: ${(props) => props.theme.colors.grayBackground};
	padding: 12px;
	margin: ${(props) => props.margin * 8}px 0;
	cursor: pointer;
	user-select: none;
	transition: all 0.2s linear;
	border-radius: 6px;
	position: relative;

	${(props) =>
		props.minWidth &&
		css`
			min-width: ${props.minWidth}px;
		`}
	&:hover {
		background-color: ${(props) => darken(0.05, props.theme.colors.grayBackground)};
	}

	select {
		outline: none;
		border: none;
		background: transparent;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		padding: 34px 16px 16px 16px;
		color: #838894;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;

		&[disabled] {
			cursor: not-allowed;
		}

		&::-ms-expand {
			display: none;
		}
	}
`;

interface Option {
	value: number | string;
	label: string;
}

interface TrackerSelectProps {
	title: string;
	value?: number | string;
	options: Option[];
	valueChanged: (newValue: number | string) => void;
	disabled?: boolean;
	isNumber?: boolean;
	minWidth?: number;
	placeholder?: string;
	margin?: number;
}

export const TrackerSelect = ({
	placeholder = 'Click to select',
	title,
	value,
	options,
	valueChanged,
	minWidth,
	disabled = false,
	isNumber = true,
	margin = 1
}: TrackerSelectProps): JSX.Element => (
	<TrackerSelectStyled minWidth={minWidth} margin={margin}>
		<select
			disabled={disabled}
			defaultValue={`${value ? value : ''}`}
			onChange={(event) =>
				valueChanged(isNumber ? parseInt(event.target.value) : event.target.value)
			}
		>
			<option value="">{placeholder}</option>
			{options.map((option, optionIndex) => (
				<option key={optionIndex} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
		<div>
			<small>{title}</small>
			<p>&nbsp;</p>
		</div>
		<CaretIcon />
	</TrackerSelectStyled>
);
