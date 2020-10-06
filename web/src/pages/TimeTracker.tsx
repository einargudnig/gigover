import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { useActiveTimeTrackers } from '../queries/useActiveTimeTrackers';
import { useTrackerReport } from '../queries/useTrackerReport';
import { useTrackerStart } from '../queries/useTrackerStart';
import { useTrackerStop } from '../queries/useTrackerStop';

const TimeTrackerStyled = styled.div``;

export const TimeTracker = (): JSX.Element => {
	const [getTrackers, { data, isLoading, isError, error }] = useActiveTimeTrackers();
	const [getReport] = useTrackerReport();

	const [startTask] = useTrackerStart();
	const [stopTask] = useTrackerStop();

	// TODO DEBUG REMOVE
	const startTracker = async () => {
		// await startTask({
		// 	projectId: projectId,
		// 	taskId: task.taskId,
		// 	uId: project?.project.workers[0].uId || ''
		// });
	};

	const stopTracker = async () => {
		// await stopTask({
		// 	projectId: projectId,
		// 	taskId: task.taskId,
		// 	uId: project?.project.workers[0].uId || ''
		// });
	};

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
