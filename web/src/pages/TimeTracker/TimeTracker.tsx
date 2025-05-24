import { Box, Button, Card, CardBody, Divider, Flex, Heading } from '@chakra-ui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Timer from 'react-compound-timer';
import { Theme } from '../../Theme';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Page } from '../../components/Page';
import { Table } from '../../components/Table';
import { DisabledPage } from '../../components/disabled/DisbledPage';
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
		isPending: reportDataLoading
	} = useTrackerReport();
	const {
		mutateAsync: activeTrackers,
		data,
		isPending: activeTimerLoading
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
		activeTrackers();
		getReport();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetch]);

	return (
		<>
			<Page title={'Time tracker'}>
				<DisabledPage>
					<Card
						borderRadius="12px"
						background="#fff"
						boxShadow={Theme.boxShadow()}
						p={6}
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Box />
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							flexDirection="column"
						>
							<Heading as="h3" size="md" fontWeight="normal" paddingTop={6} pb={2}>
								Timesheets
							</Heading>
							{reportDataLoading ? (
								<Heading as="h1" size="xl">
									<LoadingSpinner />
								</Heading>
							) : (
								<Heading as="h1" size="xl">
									{totalTimesheets}
								</Heading>
							)}
						</Box>
						<Divider
							orientation="vertical"
							height="100px"
							borderColor={Theme.colors.border}
						/>
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							flexDirection="column"
						>
							<Heading as="h3" size="md" fontWeight="normal" paddingTop={6} pb={2}>
								Minutes tracked
							</Heading>
							{reportDataLoading ? (
								<Heading as="h1" size="xl">
									<LoadingSpinner />
								</Heading>
							) : (
								<Heading as="h1" size="xl">
									{secondsToString(totalMinutes * 60)}
								</Heading>
							)}
						</Box>
						<Divider
							orientation="vertical"
							height="100px"
							borderColor={Theme.colors.border}
						/>
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							flexDirection="column"
						>
							<Heading as="h3" size="md" fontWeight="normal" paddingTop={6} pb={2}>
								Workers
							</Heading>
							{reportDataLoading ? (
								<Heading as="h1" size="xl">
									<LoadingSpinner />
								</Heading>
							) : (
								<Heading as="h1" size="xl">
									{reportData?.data.report?.length || 0}
								</Heading>
							)}
						</Box>
						<Box />
					</Card>
					<Card
						borderRadius="12px"
						background="#fff"
						boxShadow={Theme.boxShadow()}
						p={6}
						my={6}
					>
						<CardBody p={0}>
							<Flex justify="space-between" align="center" mb={Theme.padding(3)}>
								<Heading as="h3" size="md">
									Active timers
								</Heading>
								<StartTrackingAction />
							</Flex>
							<Box>
								{!hasWorkers ? (
									<Box mt={6}>
										<EmptyState
											title={'No current active workers'}
											text={'Start tracking to see active timers'}
											action={<StartTrackingAction />}
										/>
									</Box>
								) : (
									<Table>
										<thead>
											<tr>
												<th>Project</th>
												<th>Worker</th>
												<th style={{ width: 200, textAlign: 'center' }}>
													Timer
												</th>
											</tr>
										</thead>
										<tbody>
											{data?.data?.workers?.map((worker) =>
												worker.timeSheets.map(
													(timeSheet, timeSheetIndex) => (
														<tr key={`${worker.uId}_${timeSheetIndex}`}>
															<td>
																{getActiveTrackerHeader(
																	timeSheet.projectId,
																	timeSheet.taskId
																)}
															</td>
															<td>{worker.name}</td>
															<td>
																<Flex
																	justify="flex-end"
																	align="center"
																>
																	<Box
																		fontSize="2xl"
																		fontWeight="light"
																		border="1px solid #e5e5e5"
																		padding={3}
																		marginRight={3}
																		borderRadius="md"
																		userSelect="none"
																	>
																		<Timer
																			formatValue={(value) =>
																				value < 10
																					? `0${value}`
																					: value.toString()
																			}
																			initialTime={
																				now.getTime() -
																				timeSheet.start
																			}
																			lastUnit={'h'}
																		>
																			<Timer.Hours />:
																			<Timer.Minutes />:
																			<Timer.Seconds />
																		</Timer>
																	</Box>
																	<Button
																		variant="outline"
																		borderColor="transparent"
																		height="100%"
																		borderRadius="md"
																		paddingY={3}
																		paddingX={4}
																		fontSize="2xl"
																		_active={{
																			outline: 'none',
																			border: 'none'
																		}}
																		_focus={{
																			outline: 'none',
																			border: 'none'
																		}}
																		onClick={() =>
																			setStopConfirmationModal(
																				{
																					projectId:
																						timeSheet.projectId,
																					taskId: timeSheet.taskId,
																					uId: worker.uId
																				}
																			)
																		}
																	>
																		|&nbsp;|
																	</Button>
																</Flex>
															</td>
														</tr>
													)
												)
											)}
										</tbody>
									</Table>
								)}
							</Box>
						</CardBody>
					</Card>
					<Card
						borderRadius="12px"
						background="#fff"
						boxShadow={Theme.boxShadow()}
						p={6}
						my={6}
					>
						<CardBody p={0}>
							<Flex justify="space-between" align="center" mb={Theme.padding(3)}>
								<Heading as="h3" size="md">
									Reports
								</Heading>
							</Flex>
							{/* <TimeTrackerReport refetch={[refetch, setRefetch]} /> */}
						</CardBody>
					</Card>
				</DisabledPage>
			</Page>
			{stopConfirmationModal && (
				<StopTrackerConfirmation
					onClose={() => setStopConfirmationModal(undefined)}
					onComplete={async () => {
						setStopConfirmationModal(undefined);
						await activeTrackers();
					}}
					projectId={stopConfirmationModal.projectId}
					taskId={stopConfirmationModal.taskId}
					uId={stopConfirmationModal.uId}
				/>
			)}
		</>
	);
};
