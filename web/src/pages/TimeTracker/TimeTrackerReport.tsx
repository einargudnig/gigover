import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { TrackerSelect } from '../../components/TrackerSelect';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import { useTimeTrackerReport } from './useTimeTrackerReport';
import { EmptyState } from '../../components/empty/EmptyState';
import { darken } from 'polished';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import Timer from 'react-compound-timer';
import { Button } from '../../components/forms/Button';
import { Table } from '../../components/Table';
import { TimerContainer, TimerWrapper } from './TimeTracker';
import { formatDate } from '../../utils/StringUtils';
import { Edit } from '../../components/icons/Edit';
import { ModalContext } from '../../context/ModalContext';
import { secondsToHours, secondsToMinutes } from '../../utils/NumberUtils';
import { Center } from '../../components/Center';

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

const DatePickerWrapper = styled.div`
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

export const TimeTrackerReport = ({
	refetch: [refetchValue, setRefetch]
}: {
	refetch: [number, React.Dispatch<React.SetStateAction<number>>];
}): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const [selectedUser, setSelectedUser] = useState<string | undefined>();
	const [selectedProject, setSelectedProject] = useState<number | undefined>();
	const [startDate, setStartDate] = useState(moment().subtract(14, 'days'));
	const [endDate, setEndDate] = useState(moment());
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const { projectList, results, isLoading, totalTracked, users } = useTimeTrackerReport(
		startDate,
		endDate,
		refetchValue,
		selectedUser,
		selectedProject
	);

	return (
		<div>
			<TimeTrackerReportFilter>
				<DatePickerWrapper>
					<DateRangePicker
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
				<div>
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
								<th>Start</th>
								<th>End</th>
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
									<td>{formatDate(new Date(result.timesheet.start))}</td>
									<td>{formatDate(new Date(result.timesheet.stop))}</td>
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
															projectName: result.projectName,
															taskName: result.taskName,
															workerName: result.worker.name,
															workId: result.timesheet.workId,
															minutes: secondsToMinutes(
																result.timesheet.stop -
																	result.timesheet.start
															),
															hours: secondsToHours(
																result.timesheet.stop -
																	result.timesheet.start
															),
															callback: () => {
																setRefetch(refetchValue + 1);
															}
														}
													});
												}}
											>
												<Edit size={26} color={'#fff'} />
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
