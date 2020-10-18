import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTrackerReport } from '../../queries/useTrackerReport';
import { useProjectList } from '../../queries/useProjectList';
import { TrackerSelect } from '../../components/TrackerSelect';
import { Project } from '../../models/Project';
import { DateRangePicker, DayPickerRangeController, isInclusivelyBeforeDay } from 'react-dates';
import moment from 'moment';

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

const TimeTrackerReportStyled = styled.div``;

export const TimeTrackerReport = (): JSX.Element => {
	const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
	const [endDate, setEndDate] = useState(moment());
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const { data: projectList, isLoading: projectDataListLoading } = useProjectList();
	const [getReport, { data, isLoading }] = useTrackerReport();
	const users =
		data?.data.report.map((reportSheet) => ({
			userId: reportSheet.uId,
			name: reportSheet.name
		})) ?? [];

	useEffect(() => {
		getReport({});
	}, []);

	const projectMap: Map<number, Project> = useMemo(() => {
		const pMap = new Map<number, Project>();
		if (!isLoading && !projectDataListLoading && data?.data && projectList?.projects.length) {
			data.data.report.forEach((reportSheet) => {
				reportSheet.timeSheets.forEach((ts) => {
					if (!pMap.get(ts.projectId)) {
						const project = projectList.projects.find(
							(p) => p.projectId === ts.projectId
						);
						if (project) {
							pMap.set(ts.projectId, project);
						}
					}
				});
			});
		}

		return pMap;
	}, [data, projectList, isLoading, projectDataListLoading]);

	return (
		<TimeTrackerReportStyled>
			<TimeTrackerReportFilter>
				<div>
					<DateRangePicker
						isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
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
				</div>
				<div>
					<TrackerSelect
						minWidth={200}
						title={'Select user'}
						isNumber={false}
						options={users.map((u) => ({ value: u.userId, label: u.name }))}
						valueChanged={(newValue) => {
							console.log(newValue.toString());
						}}
					/>
					<TrackerSelect
						minWidth={200}
						title={'Select project'}
						isNumber={true}
						options={Array.from(projectMap.keys()).map((id) => ({
							value: id,
							label: projectMap.get(id)!.name
						}))}
						valueChanged={(newValue) => {
							console.log(newValue);
						}}
					/>
				</div>
			</TimeTrackerReportFilter>
			<p>Test</p>
		</TimeTrackerReportStyled>
	);
};
