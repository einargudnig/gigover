import React from 'react';
import styled from 'styled-components';
import { CaretIcon } from './icons/CaretIcon';
import { darken } from 'polished';

const TrackerSelectStyled = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: ${(props) => props.theme.colors.grayBackground};
	padding: 16px;
	margin: 8px 0;
	cursor: pointer;
	user-select: none;
	transition: all 0.2s linear;
	border-radius: 6px;
	position: relative;

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
}

export const TrackerSelect = ({
	title,
	value,
	options,
	valueChanged,
	disabled = false
}: TrackerSelectProps): JSX.Element => (
	<TrackerSelectStyled>
		<select
			disabled={disabled}
			defaultValue={value}
			onChange={(event) => valueChanged(parseInt(event.target.value))}
		>
			<option value="">Click to select</option>
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
