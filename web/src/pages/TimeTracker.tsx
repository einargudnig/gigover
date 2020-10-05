import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { useActiveTimeTrackers } from '../queries/useActiveTimeTrackers';
import { useTrackerReport } from '../queries/useTrackerReport';

const TimeTrackerStyled = styled.div``;

export const TimeTracker = (): JSX.Element => {
	const [getTrackers, { data, isLoading, isError, error }] = useActiveTimeTrackers();
	const [getReport] = useTrackerReport();

	useEffect(() => {
		getTrackers({});
		getReport({});
	}, []);

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
