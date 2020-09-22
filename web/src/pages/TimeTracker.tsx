import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';

interface TimeTrackerProps {}

const TimeTrackerStyled = styled.div``;

export const TimeTracker = ({}: TimeTrackerProps): JSX.Element => {
	return (
		<Page title={'Time tracker'}>
			<TimeTrackerStyled>
				<h1>Time Tracker</h1>
			</TimeTrackerStyled>
		</Page>
	);
};
