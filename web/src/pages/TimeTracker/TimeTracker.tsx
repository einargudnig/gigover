import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Card,
	CardBody,
	Divider,
	Flex,
	Heading,
	Link,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack
} from '@chakra-ui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { createTimeModel, useTimeModel } from 'react-compound-timer';
import { Theme } from '../../Theme';
import { LoadingSpinner } from '../../components/LoadingSpinner';
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
import { TimeTrackerReport } from './TimeTrackerReport';
import { DataFetchingErrorBoundary } from '../../components/ErrorBoundary';

// Helper function to format time units (e.g., 9 -> "09", 10 -> "10")
const formatTimeUnit = (unit: number): string => (unit < 10 ? `0${unit}` : unit.toString());

// New component to display the timer using the new API
interface ActiveTimerDisplayProps {
	initialTimeMs: number;
	lastUnit?: 'd' | 'h' | 'm' | 's';
}

const ActiveTimerDisplay: React.FC<ActiveTimerDisplayProps> = ({
	initialTimeMs,
	lastUnit = 'h'
}) => {
	const timerModel = React.useMemo(
		() =>
			createTimeModel({
				initialTime: initialTimeMs,
				direction: 'forward',
				lastUnit: lastUnit,
				startImmediately: true
			}),
		[initialTimeMs, lastUnit]
	);

	const { value } = useTimeModel(timerModel);

	// value object from useTimeModel contains h, m, s, ms etc.
	return (
		<>
			{formatTimeUnit(value.h)}:{formatTimeUnit(value.m)}:{formatTimeUnit(value.s)}
		</>
	);
};

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

	const hasWorkers = (data?.workers && data.workers.length > 0) ?? false;

	useEffect(() => {
		activeTrackers({});
		getReport();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetch]);

	const pageTitle = 'Time tracker';
	const breadcrumbs = [{ title: 'Time tracker', url: '/time-tracker' }];

	return (
		<>
			<Box
				as="header"
				borderBottom="1px solid"
				borderColor="gray.200"
				boxShadow="6px 6px 25px rgba(0, 0, 0, 0.03)"
				bg="white" // Or transparent if Page.tsx sets a default bg for content
				mb={4} // Margin to separate from content
				px={3}
			>
				<Box height={'50px'} display={'flex'} alignItems={'center'}>
					{breadcrumbs ? (
						<Breadcrumb
							spacing="8px"
							// separator={<Chevron direction="right" color={Theme.colors.green} />}
						>
							{breadcrumbs.map((breadcrumb, bIndex) => (
								<BreadcrumbItem key={bIndex}>
									{breadcrumb.url ? (
										<BreadcrumbLink as={Link} href={breadcrumb.url}>
											{breadcrumb.title}
										</BreadcrumbLink>
									) : (
										<Text as="span">{breadcrumb.title}</Text> // For non-link breadcrumbs
									)}
								</BreadcrumbItem>
							))}
						</Breadcrumb>
					) : (
						<Heading as="h1" size="lg" color="black">
							{pageTitle}
						</Heading>
					)}
				</Box>
			</Box>
			<Box p={2}>
				<DisabledPage>
					<DataFetchingErrorBoundary
						name="TimeTracker"
						loadingState={reportDataLoading || activeTimerLoading}
						onRetry={async () => {
							await activeTrackers({});
							await getReport();
						}}
					>
						<Card
							borderRadius="12px"
							background="#fff"
							boxShadow={Theme.boxShadow()}
							p={6}
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<Flex justifyContent="space-around" alignItems="center" w="100%">
								<Box>
									<VStack>
										<Heading
											as="h3"
											size="md"
											fontWeight="normal"
											paddingTop={6}
											pb={2}
										>
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
									</VStack>
								</Box>
								<Divider
									orientation="vertical"
									height="100px"
									borderColor={Theme.colors.border}
								/>
								<Box>
									<VStack>
										<Heading
											as="h3"
											size="md"
											fontWeight="normal"
											paddingTop={6}
											pb={2}
										>
											Minutes tracked
										</Heading>
										{reportDataLoading ? (
											<Heading as="h1" size="xl">
												<LoadingSpinner />
											</Heading>
										) : (
											<Heading as="h1" size="md">
												{secondsToString(totalMinutes * 60)}
											</Heading>
										)}
									</VStack>
								</Box>
								<Divider
									orientation="vertical"
									height="100px"
									borderColor={Theme.colors.border}
								/>
								<Box>
									<VStack>
										<Heading
											as="h3"
											size="md"
											fontWeight="normal"
											paddingTop={6}
											pb={2}
										>
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
									</VStack>
								</Box>
							</Flex>
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
									<Heading as="h3" size="sm">
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
											<Thead>
												<Tr>
													<Th>Project</Th>
													<Th>Worker</Th>
													<Th style={{ width: 200, textAlign: 'center' }}>
														Timer
													</Th>
												</Tr>
											</Thead>
											<Tbody>
												{data?.workers?.map((worker) =>
													worker.timeSheets.map(
														(timeSheet, timeSheetIndex) => (
															<Tr
																key={`${worker.uId}_${timeSheetIndex}`}
															>
																<Td>
																	{getActiveTrackerHeader(
																		timeSheet.projectId,
																		timeSheet.taskId
																	)}
																</Td>
																<Td>{worker.name}</Td>
																<Td>
																	<Flex
																		justify="flex-end"
																		align="center"
																	>
																		<Box
																			fontSize="lg"
																			fontWeight="light"
																			border="1px solid #e5e5e5"
																			padding={3}
																			marginRight={3}
																			borderRadius="md"
																			userSelect="none"
																		>
																			<ActiveTimerDisplay
																				initialTimeMs={
																					now.getTime() -
																					timeSheet.start
																				}
																				lastUnit={'h'}
																			/>
																		</Box>
																		<Button
																			variant="outline"
																			aria-label="Stop timer"
																			colorScheme="black"
																			height="100%"
																			borderRadius="md"
																			paddingY={3}
																			paddingX={4}
																			fontSize="lg"
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
																</Td>
															</Tr>
														)
													)
												)}
											</Tbody>
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
									<Heading as="h3" size="sm">
										Reports
									</Heading>
								</Flex>
								<TimeTrackerReport refetch={[refetch, setRefetch]} />
							</CardBody>
						</Card>
					</DataFetchingErrorBoundary>
				</DisabledPage>
			</Box>

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
