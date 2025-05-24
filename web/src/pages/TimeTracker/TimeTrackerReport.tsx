import { Box, Button, Flex } from '@chakra-ui/react';
import moment from 'moment';
import React, { useCallback, useContext, useState } from 'react';
import Timer from 'react-compound-timer';
import { Theme } from '../../Theme';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Table } from '../../components/Table';
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
import { MomentDateFormat } from '../../utils/MomentDateFormat';
import { showTimeSheetRange } from '../../utils/StringUtils';
import { displayTaskTitle } from '../../utils/TaskUtils';
import { useTimeTrackerReport } from './useTimeTrackerReport';

interface TimeTrackerReportProps {
	refetch: [number, React.Dispatch<React.SetStateAction<number>>];
}

export const TimeTrackerReport = ({
	refetch: [refetchValue, setRefetch]
}: TimeTrackerReportProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const [selectedUser, setSelectedUser] = useState<string | undefined>();
	const [selectedProject, setSelectedProject] = useState<number | undefined>();
	const [selectedTask, setSelectedTask] = useState<number | undefined>();
	const [startDate, setStartDate] = useState<moment.Moment | null>(moment().subtract(14, 'days'));
	const [endDate, setEndDate] = useState<moment.Moment | null>(moment());
	const reportToCSV = useReportToCSV();
	const deleteTimeRecord = useDeleteTimeRecord();
	const { projectList, results, isLoading, totalTracked, users } = useTimeTrackerReport(
		startDate || moment().subtract(14, 'days'),
		endDate || moment(),
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
					`from=${startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss')}`
				);
			}

			if (endDate) {
				parameterString.push(`to=${endDate.endOf('day').format('YYYY-MM-DD HH:mm:ss')}`);
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
			<Flex alignItems="center" justifyContent="space-between" my={Theme.padding(2)}>
				<Flex flex={1} mr={Theme.padding(2)} alignItems="center">
					<DatePicker
						startDate={startDate ? startDate.toDate() : null}
						endDate={endDate ? endDate.toDate() : null}
						onChange={(update: [Date | null, Date | null] | Date | null) => {
							if (Array.isArray(update)) {
								const [start, end] = update;
								setStartDate(start ? moment(start) : null);
								setEndDate(end ? moment(end) : null);
							}
						}}
						selectsRange
						dateFormat={MomentDateFormat}
						isClearable
					/>
					<Box style={{ width: 8 }} />
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
						margin={0}
					/>
					<div style={{ width: 8 }} />
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
						margin={0}
					/>
					<div style={{ width: 8 }} />
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
						margin={0}
					/>
				</Flex>
				<Flex>
					<Button
						disabled={!selectedProject}
						onClick={() => exportToCsv()}
						height={'100%'}
						ml={4}
						variant={'outline'}
						colorScheme="gray"
					>
						Export CSV
					</Button>
				</Flex>
			</Flex>
			<Box style={{ marginTop: 24 }}>
				{isLoading ? (
					<Center>
						<LoadingSpinner size={32} />
					</Center>
				) : results.length > 0 ? (
					<Table>
						<thead>
							<tr>
								<th>Project</th>
								<th>Worker</th>
								<th>Time</th>
								<th />
								<th align={'center'} style={{ width: 200 }}>
									Timer
								</th>
							</tr>
						</thead>
						<tbody>
							{results.map((result, resultIndex) => (
								<tr key={`${resultIndex}`}>
									<td>
										<strong>{result.projectName}</strong>
										<br />
										<p>{result.taskName}</p>
									</td>
									<td>{result.worker.name}</td>
									<td>
										{showTimeSheetRange(
											new Date(result.timesheet.start),
											new Date(result.timesheet.stop)
										)}
									</td>
									<td />
									<td>
										<Flex justify="flex-end" align="center">
											<Box
												fontSize="2xl"
												fontWeight="light"
												border="1px solid"
												borderColor="gray.200"
												padding={3}
												marginRight={3}
												borderRadius="md"
												userSelect="none"
											>
												<Timer
													startImmediately={false}
													formatValue={(value) =>
														value < 10 ? `0${value}` : value.toString()
													}
													initialTime={
														result.timesheet.stop -
														result.timesheet.start
													}
													lastUnit={'h'}
												>
													<Timer.Hours />:
													<Timer.Minutes />:
													<Timer.Seconds />
												</Timer>
											</Box>
											<Button
												ml={2}
												colorScheme="blue"
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
												<Edit size={26} color={'#fff'} />
											</Button>
											<Button
												ml={2}
												colorScheme={'red'}
												onClick={() => {
													if (
														confirm(
															'Are you sure you want to delete this report?'
														)
													) {
														// @ts-ignore
														deleteRecord(result.timesheet);
													}
												}}
											>
												<TrashIcon size={26} color={'#fff'} />
											</Button>
										</Flex>
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan={4} align={'right'}>
									<strong>Total:</strong>
								</td>
								<td>{totalTracked}</td>
							</tr>
						</tfoot>
					</Table>
				) : (
					<EmptyState
						title={'No report available'}
						text={`We could not find any timesheets between ${startDate?.format(
							'D MMM YYYY'
						)} and ${endDate?.format('D MMM YYYY')}`}
					/>
				)}
			</Box>
		</Box>
	);
};
