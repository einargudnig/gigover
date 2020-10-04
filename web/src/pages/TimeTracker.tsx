import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { useActiveTimeTrackers } from '../queries/useActiveTimeTrackers';

const TimeTrackerStyled = styled.div``;

export const TimeTracker = (): JSX.Element => {
	const { data, isLoading, isError, error } = useActiveTimeTrackers();

	return (
		<>
			<Page title={'Time tracker'}>
				<TimeTrackerStyled>
					<h1>Time Tracker</h1>
				</TimeTrackerStyled>
			</Page>
		</>
	);
};
