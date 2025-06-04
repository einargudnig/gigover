import {
	Box,
	Button,
	Flex,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Tfoot,
	Th,
	Thead,
	Tr
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import React, { useCallback, useContext, useState } from 'react';
import { createTimeModel, useTimeModel } from 'react-compound-timer';
import { Center } from '../../components/Center';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { TrackerSelect } from '../../components/TrackerSelect';
import { EmptyState } from '../../components/empty/EmptyState';
import { DatePicker } from '../../components/forms/DatePicker';
import { Edit } from '../../components/icons/Edit';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { ModalContext } from '../../context/ModalContext';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { useDeleteTimeRecord } from '../../mutations/useDeleteTimeRecord';
import { useReportToCSV } from '../../mutations/useReportToCSV';
import { Timesheet } from '../../queries/useTrackerReport';
import { APP_DATE_FORMAT } from '../../utils/AppDateFormat';
import { showTimeSheetRange } from '../../utils/StringUtils';
import { displayTaskTitle } from '../../utils/TaskUtils';
import { useTimeTrackerReport } from './useTimeTrackerReport';

interface TimeTrackerReportProps {
	refetch: [number, React.Dispatch<React.SetStateAction<number>>];
}

// Helper function to format time units (e.g., 9 -> "09", 10 -> "10")
const formatTimeUnit = (unit: number): string => (unit < 10 ? `0${unit}` : unit.toString());

// New component to display a static duration using the new API
interface StaticDurationDisplayProps {
	durationMs: number;
	lastUnit?: 'd' | 'h' | 'm' | 's';
}

const StaticDurationDisplay: React.FC<StaticDurationDisplayProps> = ({
	durationMs,
	lastUnit = 'h'
}) => {
	const timerModel = React.useMemo(
		() =>
			createTimeModel({
				initialTime: durationMs,
				direction: 'forward', // Direction mostly irrelevant for non-starting timer
				lastUnit: lastUnit,
				startImmediately: false // Important: for displaying static duration
			}),
		[durationMs, lastUnit]
	);

	const { value } = useTimeModel(timerModel);

	return (
		<>
			{formatTimeUnit(value.h)}:{formatTimeUnit(value.m)}:{formatTimeUnit(value.s)}
		</>
	);
};

export const TimeTrackerReport = ({
	refetch: [refetchValue, setRefetch]
}: TimeTrackerReportProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const [selectedUser, setSelectedUser] = useState<string | undefined>();
	const [selectedProject, setSelectedProject] = useState<number | undefined>();
	const [selectedTask, setSelectedTask] = useState<number | undefined>();
	const [startDate, setStartDate] = useState<DateTime | null>(DateTime.now().minus({ days: 14 }));
	const [endDate, setEndDate] = useState<DateTime | null>(DateTime.now());
	const [dialogOpen, setDialogOpen] = useState(false);
	const reportToCSV = useReportToCSV();
	const deleteTimeRecord = useDeleteTimeRecord();
	const { projectList, results, isLoading, totalTracked, users } = useTimeTrackerReport(
		startDate || DateTime.now().minus({ days: 14 }),
		endDate || DateTime.now(),
		refetchValue,
		selectedUser,
		selectedProject,
		selectedTask
	);

	const exportToCsv = useCallback(async () => {
		try {
			const parameterString: string[] = [];

			if (selectedProject) {
				parameterString.push(`projectId=${selectedProject}`);
			}

			if (selectedTask) {
				parameterString.push(`taskId=${selectedTask}`);
			}

			if (selectedUser) {
				parameterString.push(`workerId=${selectedUser}`);
			}

			if (startDate) {
				parameterString.push(
					`from=${startDate.startOf('day').toFormat('yyyy-MM-dd HH:mm:ss')}`
				);
			}

			if (endDate) {
				parameterString.push(`to=${endDate.endOf('day').toFormat('yyyy-MM-dd HH:mm:ss')}`);
			}

			await reportToCSV.mutateAsync({
				name: 'workReport',
				parameters: parameterString.join('|')
			});
		} catch (e) {
			console.error(e);
			alert('Could not export to CSV, contact support or try again later.');
		}
	}, [reportToCSV, selectedProject, selectedTask, selectedUser, startDate, endDate]);

	const projectTasks = useProjectTasks(
		projectList.find((pl) => pl.projectId === selectedProject)
	);

	const deleteRecord = async (timesheet: Timesheet) => {
		try {
			await deleteTimeRecord.mutateAsync(timesheet);
			setRefetch(++refetchValue);
		} catch (e) {
			console.error(e);
			alert('Could not delete timesheet, please try again');
		}
	};

	return (
		<Box>
			<Flex alignItems={'flex-end'} justifyContent="space-between">
				<Box w="100%">
					<Flex w="100%" alignItems="flex-end" justifyContent="space-between">
						<Box w="100%" marginRight={6}>
							<DatePicker
								startDate={startDate ? startDate.toJSDate() : null}
								endDate={endDate ? endDate.toJSDate() : null}
								onChange={(update: [Date | null, Date | null] | Date | null) => {
									if (Array.isArray(update)) {
										const [start, end] = update;
										setStartDate(start ? DateTime.fromJSDate(start) : null);
										setEndDate(end ? DateTime.fromJSDate(end) : null);
									}
								}}
								selectsRange
								dateFormat={APP_DATE_FORMAT}
								isClearable
							/>
						</Box>
						<Spacer />
						<Box>
							<Flex alignItems={'center'}>
								<TrackerSelect
									minWidth={200}
									title={'Select project'}
									placeholder={'All projects'}
									isNumber={true}
									value={selectedProject}
									options={projectList.map((p) => ({
										label: p.name,
										value: p.projectId
									}))}
									valueChanged={(newValue) => {
										const v = newValue as number;
										if (v > 0) {
											setSelectedProject(newValue as number);
										} else {
											setSelectedProject(undefined);
										}
									}}
								/>
								<Box w={2} />
								<TrackerSelect
									minWidth={200}
									title={'Select task'}
									placeholder={'All tasks'}
									isNumber={true}
									value={selectedTask}
									options={projectTasks.map((p) => ({
										label: displayTaskTitle(p),
										value: p.taskId
									}))}
									valueChanged={(newValue) => {
										const v = newValue as number;
										if (v > 0) {
											setSelectedTask(newValue as number);
										} else {
											setSelectedTask(undefined);
										}
									}}
								/>
								<Box w={2} />
								<TrackerSelect
									minWidth={200}
									title={'Select user'}
									placeholder={'All users'}
									isNumber={false}
									value={selectedUser}
									options={users.map((u) => ({ value: u.userId, label: u.name }))}
									valueChanged={(newValue) => {
										const v = newValue.toString();
										if (v.length > 0) {
											setSelectedUser(newValue as string);
										} else {
											setSelectedUser(undefined);
										}
									}}
								/>
							</Flex>
						</Box>
					</Flex>
				</Box>

				<Box>
					<Button
						disabled={!selectedProject}
						onClick={() => exportToCsv()}
						ml={4}
						variant={'outline'}
						colorScheme="black"
					>
						Export CSV
					</Button>
				</Box>
			</Flex>
			<Box style={{ marginTop: 24 }}>
				{isLoading ? (
					<Center>
						<LoadingSpinner size={32} />
					</Center>
				) : results.length > 0 ? (
					<Table variant="simple">
						<Thead>
							<Tr>
								<Th>Project</Th>
								<Th>Worker</Th>
								<Th>Time</Th>
								<Th />
								<Th align={'center'} style={{ width: 200 }}>
									Timer
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{results.map((result, resultIndex) => (
								<Tr key={`${resultIndex}`}>
									<Td>
										<strong>{result.projectName}</strong>
										<br />
										<p>{result.taskName}</p>
									</Td>
									<Td>{result.worker.name}</Td>
									<Td>
										{showTimeSheetRange(
											new Date(result.timesheet.start),
											new Date(result.timesheet.stop)
										)}
									</Td>
									<Td />
									<Td>
										<Flex justify="flex-end" align="center">
											<Box
												fontSize="lg"
												fontWeight="light"
												border="1px solid"
												borderColor="gray.200"
												padding={3}
												marginRight={3}
												borderRadius="md"
												userSelect="none"
											>
												<StaticDurationDisplay
													durationMs={
														result.timesheet.stop -
														result.timesheet.start
													}
													lastUnit={'h'}
												/>
											</Box>
											<Button
												ml={2}
												variant={'outline'}
												colorScheme="black"
												onClick={() => {
													setModalContext({
														editTimeTracker: {
															reportItem: result,
															callback: () => {
																setRefetch(refetchValue + 1);
															}
														}
													});
												}}
											>
												<Edit size={26} color={'#000'} />
											</Button>

											<ConfirmDialog
												header={'Delete time record'}
												setIsOpen={setDialogOpen}
												callback={(b) => {
													if (b) {
														// @ts-ignore
														deleteRecord(result.timesheet);
													}

													setDialogOpen(false);
												}}
												isOpen={dialogOpen}
											>
												<Button
													aria-label={'Delete time record'}
													colorScheme={'red'}
													variant={'outline'}
													isLoading={deleteTimeRecord.isPending}
													onClick={() => setDialogOpen(true)}
													disabled={deleteTimeRecord.isPending}
													ml={2}
												>
													<TrashIcon size={26} color={'red'} />
												</Button>
											</ConfirmDialog>
										</Flex>
									</Td>
								</Tr>
							))}
						</Tbody>
						<Tfoot marginTop={4}>
							<Tr>
								<Td colSpan={4} align={'right'}>
									<strong>Total:</strong>
								</Td>
								<Td>
									<Text fontSize="xl" color="black">
										{totalTracked}
									</Text>
								</Td>
							</Tr>
						</Tfoot>
					</Table>
				) : (
					<EmptyState
						title={'No report available'}
						text={`We could not find any timesheets between ${startDate?.toFormat(
							'D MMM YYYY'
						)} and ${endDate?.toFormat('D MMM YYYY')}`}
					/>
				)}
			</Box>
		</Box>
	);
};
