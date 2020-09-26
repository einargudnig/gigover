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

	&:hover {
		background-color: ${(props) => darken(0.05, props.theme.colors.grayBackground)};
	}
`;

interface TrackerSelectProps {
	title: string;
	value: string;
	valueChanged: (newValue: string) => void;
}

export const TrackerSelect = ({ title, value, valueChanged }: TrackerSelectProps): JSX.Element => (
	<TrackerSelectStyled>
		<div>
			<small>{title}</small>
			<p>{value}</p>
		</div>
		<CaretIcon />
	</TrackerSelectStyled>
);
