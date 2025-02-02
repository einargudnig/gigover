import { GridItem, IconButton, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { Chevron } from '../../../components/icons/Chevron';
import { IModalContext, ModalContext } from '../../../context/ModalContext';
import { colorGenerator } from '../../../hooks/colorGenerator';
import { Milestone } from '../../../models/Milestone';
import { TaskItem } from '../../../models/Task';
import { displayTaskTitle } from '../../../utils/TaskUtils';
import { GantChartDates } from '../GantChartDates';
import { GantChartContext } from '../contexts/GantChartContext';
import { CalendarType, GRID_ROW_HEIGHT } from '../hooks/useGantChart';

interface GridProps {
	segments: number;
	milestones?: number;
}

const ClearGrid = styled.div<GridProps>`
	display: grid;
	border: 0;
	overflow: hidden;
	box-sizing: border-box;
	position: relative;
	grid-template-columns: repeat(${(props) => props.segments}, 1fr);
	grid-gap: 0;

	.arrow {
		position: absolute;
		height: 100%;
		width: 40px;
		top: 0;
		bottom: 0;

		&.ar-l {
			left: 0;
			background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
		}

		&.ar-r {
			right: 0;
			background: linear-gradient(-90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
		}
	}
`;

const GantGrid = styled(ClearGrid)<GridProps>`
	border-radius: 12px;
	background: #fafbfc;
	box-shadow: 0 0 1px 1px #eceeef;
	grid-template-rows: repeat(${(props) => props.milestones}, ${GRID_ROW_HEIGHT});
`;

const GridRow = styled.div<{ length: number; isToday: boolean }>`
	grid-row: 1 / span ${(props) => props.length};

	${(props) =>
		props.isToday &&
		css`
			background: rgba(0, 0, 0, 0.05);
		`};

	&:not(:first-child) {
		border-left: 1px solid #f4f5f6;
	}
`;

const GantLine = styled.span<{ isFirst: boolean; isLast: boolean }>`
	padding: 4px 8px;
	border-radius: 24px;
	align-self: center;
	font-size: 14px;
	font-weight: bold;
	cursor: pointer;
	box-shadow: 0 0 0 rgba(0, 0, 0, 0);
	transition: all 0.2s linear;
	border: 1px solid transparent;

	&:hover {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
		background-color: #fff !important;
		color: #000 !important;
		border-color: var(--chakra-colors-gray-200);
	}

	${(props) =>
		props.isFirst &&
		css`
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		`}
	${(props) =>
		props.isLast &&
		css`
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		`}
`;

interface GridItemRow {
	start: number;
	end: number;
	color: {
		backgroundColor: string;
		textColor: string;
	};
	title: string;
	typeId?: string;
	onClick: () => void;
	type: 'deliverable' | 'task' | 'empty';
}

const emptyRow = (): GridItemRow => ({
	start: 0,
	end: 0,
	color: { backgroundColor: '', textColor: '' },
	title: '',
	onClick: () => null,
	type: 'empty'
});

const convertMilestoneToRow = (
	dates: GantChartDates,
	type: CalendarType,
	milestone: Milestone,
	setModalContext: Dispatch<SetStateAction<IModalContext>>
): GridItemRow | null => {
	const colors = colorGenerator(milestone.title);
	const result = milestone.getColPositions(dates, type);

	if (!result) {
		return null;
	}

	const [start, end] = result;

	return {
		start,
		end,
		color: colors,
		title: milestone.title,
		onClick: () => {
			setModalContext({
				milestone: {
					projectId: milestone.projectId,
					milestone: milestone,
					callback: () => null
				}
			});
		},
		type: 'deliverable'
	};
};

const convertTaskToRow = (
	dates: GantChartDates,
	type: CalendarType,
	task: TaskItem,
	setModalContext: Dispatch<SetStateAction<IModalContext>>
): GridItemRow | null => {
	const colors = colorGenerator(displayTaskTitle(task));
	const result = task.getColPositions(dates, type);

	if (!result) {
		return null;
	}

	const [start, end] = result;

	return {
		start,
		end,
		color: colors,
		title: displayTaskTitle(task),
		onClick: () => {
			setModalContext({
				taskDetails: {
					projectId: task.projectId,
					task: task
				}
			});
		},
		type: 'task'
	};
};

export const GantChart = (): JSX.Element => {
	const [state, dispatch] = useContext(GantChartContext);
	const [, setModalContext] = useContext(ModalContext);
	const columns = useMemo(() => new Array(state.segments).fill(0), [state.segments]);
	const dates = useMemo<GantChartDates>(() => {
		return new GantChartDates(state.date, state.segments, state.type);
	}, [state.date, state.type, state.segments]);

	const GridItemRows: GridItemRow[] = useMemo(() => {
		if (state.rows > 0) {
			const rows: GridItemRow[] = [];

			state.milestones.forEach((m) => {
				const row = convertMilestoneToRow(dates, state.type, m, setModalContext);
				rows.push(row !== null ? row : emptyRow());

				// If it is expanded, convert the tasks to rows
				if (state.expanded.has(m.milestoneId)) {
					m.projectTasks.forEach((t) => {
						const taskRow = convertTaskToRow(dates, state.type, t, setModalContext);
						rows.push(taskRow !== null ? taskRow : emptyRow());
					});
				}
			});

			if (state.tasks.length > 0) {
				rows.push(emptyRow()); // For the divider between Deliverables and Tasks in the sidebar
			}

			// Tasks without Milestones
			state.tasks.forEach((t) => {
				const taskRow = convertTaskToRow(dates, state.type, t, setModalContext);
				rows.push(taskRow !== null ? taskRow : emptyRow());
			});

			return rows;
		}

		return [];
	}, [
		state.rows,
		state.milestones,
		state.tasks,
		state.type,
		state.expanded,
		dates,
		setModalContext
	]);

	return (
		<>
			<GridItem colStart={2} rowStart={1}>
				<ClearGrid segments={state.segments}>
					<div className="arrow ar-l">
						<IconButton
							aria-label={'previous'}
							colorScheme={'gray'}
							variant={'ghost'}
							icon={<Chevron direction={'left'} />}
							onClick={() => dispatch({ type: 'DecreaseOffset' })}
						/>
					</div>
					<div className="arrow ar-r">
						<IconButton
							aria-label={'next'}
							colorScheme={'gray'}
							variant={'ghost'}
							icon={<Chevron direction={'right'} />}
							onClick={() => dispatch({ type: 'IncreaseOffset' })}
						/>
					</div>
					{Array.from(dates.dates.values()).map((d, index) => (
						<div key={index}>
							<Text textAlign={'center'} fontSize={'sm'} color={'black'}>
								{d.title}
							</Text>
							<Text textAlign={'center'} fontSize={'xs'}>
								{d.subtitle}
							</Text>
						</div>
					))}
				</ClearGrid>
			</GridItem>
			<GridItem colStart={2} rowStart={2}>
				<GantGrid segments={state.segments} milestones={state.rows + 1 || 1}>
					{columns.map((s, index) => (
						<GridRow
							isToday={Array.from(dates.dates.values())[index].moment.isSame(
								new Date(),
								'day'
							)}
							key={index}
							length={state.project?.tasks.length ?? 1}
							style={{ gridColumn: index + 1 }}
						/>
					))}
					{GridItemRows.map((row, index) => {
						const { start, end, color } = row;

						return (
							<GantLine
								key={index}
								isFirst={start === 1}
								isLast={end >= dates.dates.size}
								style={{
									gridColumn: `${start} / ${start === end ? 'span 2' : end + 1}`,
									gridRow: `${index + 1}`,
									backgroundColor: color.backgroundColor
								}}
								onClick={row.onClick}
							>
								<Text isTruncated color={color.textColor}>
									{row.title}
								</Text>
							</GantLine>
						);
					})}
				</GantGrid>
			</GridItem>
		</>
	);
};
