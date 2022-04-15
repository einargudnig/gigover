import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { TrackerSelect } from '../../components/TrackerSelect';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import { useTimeTrackerReport } from './useTimeTrackerReport';
import { EmptyState } from '../../components/empty/EmptyState';
import { darken } from 'polished';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import Timer from 'react-compound-timer';
import { Button } from '@chakra-ui/react';
import { Table } from '../../components/Table';
import { TimerContainer, TimerWrapper } from './TimeTracker';
import { formatDate, showTimeSheetRange } from '../../utils/StringUtils';
import { Edit } from '../../components/icons/Edit';
import { ModalContext } from '../../context/ModalContext';
import { Center } from '../../components/Center';
import { MomentDateFormat } from '../../utils/MomentDateFormat';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { displayTaskTitle } from '../../utils/TaskUtils';
import { useReportToCSV } from '../../mutations/useReportToCSV';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { useDeleteTimeRecord } from '../../mutations/useDeleteTimeRecord';
import { Timesheet } from '../../queries/useTrackerReport';

const TimeTrackerReportFilter = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: ${(props) => props.theme.padding(2)} 0;

	> div:last-child {
		display: flex;

		> *:not(:last-child) {
			margin-right: ${(props) => props.theme.padding(2)};
		}
	}
`;

export const DatePickerWrapper = styled.div`
	.SingleDatePicker,
	.SingleDatePicker_1,
	.SingleDatePickerInput {
		width: 100%;
		height: 100%;

		.DateInput_input {
			line-height: 54px;
		}
	}

	.DateRangePickerInput__withBorder {
		padding: 12px;
		border-radius: 8px;
	}

	.DateInput_input__focused {
		border-bottom-color: ${(props) => props.theme.colors.green};
	}

	.CalendarDay__selected {
		background: ${(props) => props.theme.colors.darkGreen};
	}

	.CalendarDay__selected_span {
		background: ${(props) => props.theme.colors.green};
		border: 1px double ${(props) => darken(0.05, props.theme.colors.green)};
		color: #fff;
	}

	.DayPickerKeyboardShortcuts_show__bottomRight::before {
		border-right-color: ${(props) => props.theme.colors.darkGreen};
	}
`;

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
	const [startDate, setStartDate] = useState(moment().subtract(14, 'days'));
	const [endDate, setEndDate] = useState(moment());
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const reportToCSV = useReportToCSV();
	const deleteTimeRecord = useDeleteTimeRecord();
	const { projectList, results, isLoading, totalTracked, users } = useTimeTrackerReport(
		startDate,
		endDate,
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
		<div>
			<TimeTrackerReportFilter>
				<div style={{ display: 'flex', flex: 1 }}>
					<DatePickerWrapper>
						<DateRangePicker
							displayFormat={MomentDateFormat}
							isOutsideRange={() => false}
							startDate={startDate}
							startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
							endDate={endDate} // momentPropTypes.momentObj or null,
							endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
							onDatesChange={({ startDate: sDate, endDate: eDate }) => {
								if (sDate !== null) {
									setStartDate(sDate);
								}
								if (eDate !== null) {
									setEndDate(eDate);
								}
							}} // PropTypes.func.isRequired,
							focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
							onFocusChange={(fInput) => setFocusedInput(fInput)} // PropTypes.func.isRequired,
						/>
					</DatePickerWrapper>
					<div style={{ width: 8 }} />
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
				</div>
				<div>
					<Button
						disabled={!selectedProject}
						onClick={() => exportToCsv()}
						height={'100%'}
						lineHeight="72px"
						ml={4}
					>
						Export CSV
					</Button>
				</div>
			</TimeTrackerReportFilter>
			<div style={{ marginTop: 24 }}>
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
										<TimerWrapper>
											<TimerContainer>
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
											</TimerContainer>
											<Button
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
										</TimerWrapper>
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
						text={`We could not find any timesheets between ${startDate.format(
							'D MMM YYYY'
						)} and ${endDate.format('D MMM YYYY')}`}
					/>
				)}
			</div>
		</div>
	);
};
