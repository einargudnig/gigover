import React from 'react';
import styled, { css } from 'styled-components';

const TimeslotContainer = styled.div<{ inUse: boolean }>`
	padding: ${(props) => props.theme.padding(1.5)};
	background: #fff;
	box-shadow: ${(props) => props.theme.boxShadow};
	border-radius: ${(props) => props.theme.borderRadius};
	color: #000;
	width: 100%;
	height: 60px;
	font-size: 14px;

	${(props) =>
		props.inUse &&
		css`
			background: #ffedec;
			color: #9b4633;
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: bold;
		`};
`;

export interface ResourceHistoryTimeSlotProps {
	inUse?: boolean;
}

export const ResourceHistoryTimeSlot = ({ inUse }: ResourceHistoryTimeSlotProps): JSX.Element => {
	if (inUse) {
		return <TimeslotContainer inUse={true}>Resource is still in use</TimeslotContainer>;
	}

	return <TimeslotContainer inUse={false}>ResourceHistoryTimeSlotComponent</TimeslotContainer>;
};
