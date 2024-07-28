import { Button } from '@chakra-ui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Timer from 'react-compound-timer';
import styled from 'styled-components';
import { Theme } from '../../Theme';
import { CardBase } from '../../components/CardBase';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Page } from '../../components/Page';
import { Table } from '../../components/Table';
import { EmptyState } from '../../components/empty/EmptyState';
import { TimeIcon } from '../../components/icons/TimeIcon';
import { ModalContext } from '../../context/ModalContext';
import { useActiveTimeTrackers } from '../../queries/useActiveTimeTrackers';
import { useProjectList } from '../../queries/useProjectList';
import { useTrackerReport } from '../../queries/useTrackerReport';
import { TimeTrackerInput } from '../../queries/useTrackerStart';
import { secondsToString } from '../../utils/NumberUtils';
import { SubstringText } from '../../utils/StringUtils';
import { displayTaskTitle } from '../../utils/TaskUtils';
import { StopTrackerConfirmation } from './StopTrackerConfirmation';
import { TimeTrackerReport } from './TimeTrackerReport';

const TitleContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: ${(props) => props.theme.padding(3)};
`;

export const TimerWrapper = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;

	button {
		border: none;
		height: 100%;
		border-radius: 6px;
		padding: 12px 16px;
		font-size: 24px;
		margin-left: 12px;

		&:active,
		&:focus {
			outline: none;
			border: none;
		}
	}
`;

export const TimerContainer = styled.div`
	display: inline-block;
	font-size: 24px;
	font-weight: 300;
	border: 1px solid #e5e5e5;
	padding: 12px;
	margin: 12px 0;
	border-radius: 6px;
	user-select: none;
`;

const TimeTrackerTotalReport = styled(CardBase)`
	display: flex;
	justify-content: space-between;
	align-items: center;

	> div {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	h3 {
		font-weight: normal;
		padding-top: 24px;
	}

	.separator {
		height: 100px;
		width: 1px;
		background-color: ${(props) => props.theme.colors.border};
	}
`;

const ActiveTimeTrackers = styled(CardBase)`
	margin: 24px 0;
`;

export const TimeTracker = (): JSX.Element => {
	const [now, setNow] = useState(new Date());
	const [refetch, setRefetch] = useState(0);
	const [, setModalContext] = useContext(ModalContext);
	const [stopConfirmationModal, setStopConfirmationModal] = useState<
		TimeTrackerInput | undefined
	>();
	const { data: projectList } = useProjectList();
	const {
		mutateAsync: getReport,
		data: reportData,
		isLoading: reportDataLoading
	} = useTrackerReport();
	const {
		mutateAsync: activeTrackers,
		data,
		isLoading: activeTimerLoading
	} = useActiveTimeTrackers();

	const totalTimesheets = useMemo(() => {
		if (reportData?.data.report) {
			return reportData.data.report.reduce((a, b) => a + b.timeSheets.length, 0);
		}

		return 0;
	}, [reportData]);

	const totalMinutes = useMemo(() => {
		if (reportData?.data.report) {
			return reportData.data.report.reduce(
				(a, b) => a + b.timeSheets.reduce((c, d) => c + d.minutes, 0),
				0
			);
		}

		return 0;
	}, [reportData]);

	const getActiveTrackerHeader = (projectId: number, taskId: number): React.ReactNode => {
		let projectName = `Unknown project (${projectId})`;
		let taskName = `Unknown task (${taskId})`;

		if (projectList && projectList.length > 0) {
			const pj = projectList.find((p) => p.projectId === projectId);

			if (pj) {
				projectName = pj.name;
				const task = pj.tasks.find((t) => t.taskId === taskId);

				if (task) {
					taskName = SubstringText(displayTaskTitle(task), 70);
				}
			}
		}

		return (
			<>
				<strong>{projectName}</strong>
				<br />
				<p>{taskName}</p>
			</>
		);
	};

	const StartTrackingAction = () => (
		<Button
			isDisabled={reportDataLoading || activeTimerLoading}
			leftIcon={<TimeIcon color={Theme.colors.black} />}
			onClick={() => {
				if (!(reportDataLoading || activeTimerLoading)) {
					setModalContext({
						timeTracker: {
							callback: () => {
								setNow(new Date());
								setRefetch(refetch + 1);
							}
						}
					});
				}
			}}
		>
			<span>Start timer</span>
		</Button>
	);

	const hasWorkers = (data?.data.workers && data?.data.workers.length > 0) ?? false;

	useEffect(() => {
		activeTrackers({});
		getReport({});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetch]);

	return (
		<>
			<Page title={'Time tracker'}>
				<TimeTrackerTotalReport>
					<div />
					<div>
						<h3>Timesheets</h3>
						{reportDataLoading ? (
							<h1>
								<LoadingSpinner />
							</h1>
						) : (
							<h1>{totalTimesheets}</h1>
						)}
					</div>
					<div className={'separator'} />
					<div>
						<h3>Minutes tracked</h3>
						{reportDataLoading ? (
							<h1>
								<LoadingSpinner />
							</h1>
						) : (
							<h1>{secondsToString(totalMinutes * 60)}</h1>
						)}
					</div>
					<div className={'separator'} />
					<div>
						<h3>Workers</h3>
						{reportDataLoading ? (
							<h1>
								<LoadingSpinner />
							</h1>
						) : (
							<h1>{reportData?.data.report?.length || 0}</h1>
						)}
					</div>
					<div />
				</TimeTrackerTotalReport>
				<ActiveTimeTrackers>
					<TitleContainer>
						<h3>Active timers</h3>
						<StartTrackingAction />
					</TitleContainer>
					<div>
						{!hasWorkers ? (
							<div style={{ marginTop: 24 }}>
								<EmptyState
									title={'No current active workers'}
									text={'Start tracking to see active timers'}
									action={<StartTrackingAction />}
								/>
							</div>
						) : (
							<Table>
								<thead>
									<tr>
										<th>Project</th>
										<th>Worker</th>
										<th align={'center'} style={{ width: 200 }}>
											Timer
										</th>
									</tr>
								</thead>
								<tbody>
									{data?.data?.workers?.map((worker) =>
										worker.timeSheets.map((timeSheet, timeSheetIndex) => (
											<tr key={`${worker.uId}_${timeSheetIndex}`}>
												<td>
													{getActiveTrackerHeader(
														timeSheet.projectId,
														timeSheet.taskId
													)}
												</td>
												<td>{worker.name}</td>
												<td>
													<TimerWrapper>
														<TimerContainer>
															<Timer
																formatValue={(value) =>
																	value < 10
																		? `0${value}`
																		: value.toString()
																}
																initialTime={
																	now.getTime() - timeSheet.start
																}
																lastUnit={'h'}
															>
																<Timer.Hours />:
																<Timer.Minutes />:
																<Timer.Seconds />
															</Timer>
														</TimerContainer>
														<Button
															onClick={() =>
																setStopConfirmationModal({
																	projectId: timeSheet.projectId,
																	taskId: timeSheet.taskId,
																	uId: worker.uId
																})
															}
														>
															|&nbsp;|
														</Button>
													</TimerWrapper>
												</td>
											</tr>
										))
									)}
								</tbody>
							</Table>
						)}
					</div>
				</ActiveTimeTrackers>
				<ActiveTimeTrackers>
					<TitleContainer>
						<h3>Reports</h3>
					</TitleContainer>
					<TimeTrackerReport refetch={[refetch, setRefetch]} />
				</ActiveTimeTrackers>
			</Page>
			{stopConfirmationModal && (
				<StopTrackerConfirmation
					onClose={() => setStopConfirmationModal(undefined)}
					onComplete={async () => {
						setStopConfirmationModal(undefined);
						await activeTrackers({});
					}}
					projectId={stopConfirmationModal.projectId}
					taskId={stopConfirmationModal.taskId}
					uId={stopConfirmationModal.uId}
				/>
			)}
		</>
	);
};
