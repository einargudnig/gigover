import { Box, Grid, GridItem, IconButton, Text } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { Chevron } from '../../../components/icons/Chevron';
import { IModalContext, ModalContext } from '../../../context/ModalContext';
import { colorGenerator } from '../../../hooks/colorGenerator';
import { Milestone } from '../../../models/Milestone';
import { TaskItem } from '../../../models/Task';
import { displayTaskTitle } from '../../../utils/TaskUtils';
import { GantChartDates } from '../GantChartDates';
import { GantChartContext } from '../contexts/GantChartContext';
import { CalendarType, GRID_ROW_HEIGHT } from '../hooks/useGantChart';

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

	console.log('dates', dates);

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
				<Grid
					templateColumns={`repeat(${state.segments}, 1fr)`}
					gap={0}
					borderWidth={0}
					overflow="hidden"
					boxSizing="border-box"
					position="relative"
				>
					<Box
						position="absolute"
						height="100%"
						width="40px"
						top={0}
						bottom={0}
						left={0}
						background="linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%)"
					>
						<IconButton
							aria-label={'previous'}
							colorScheme={'gray'}
							variant={'ghost'}
							icon={<Chevron direction={'left'} />}
							onClick={() => dispatch({ type: 'DecreaseOffset' })}
						/>
					</Box>
					<Box
						position="absolute"
						height="100%"
						width="40px"
						top={0}
						bottom={0}
						right={0}
						background="linear-gradient(-90deg, #fff 0%, rgba(255, 255, 255, 0) 100%)"
					>
						<IconButton
							aria-label={'next'}
							colorScheme={'gray'}
							variant={'ghost'}
							icon={<Chevron direction={'right'} />}
							onClick={() => dispatch({ type: 'IncreaseOffset' })}
						/>
					</Box>
					{Array.from(dates.dates.values()).map((d, index) => (
						<Box key={index}>
							<Text textAlign={'center'} fontSize={'sm'} color={'black'}>
								{d.title}
							</Text>
							<Text textAlign={'center'} fontSize={'xs'}>
								{d.subtitle}
							</Text>
						</Box>
					))}
				</Grid>
			</GridItem>
			<GridItem colStart={2} rowStart={2}>
				<Grid
					templateColumns={`repeat(${state.segments}, 1fr)`}
					templateRows={`repeat(${state.rows + 1 || 1}, ${GRID_ROW_HEIGHT})`}
					borderRadius="12px"
					background="#fafbfc"
					boxShadow="0 0 1px 1px #eceeef"
					gap={0}
					borderWidth={0}
					overflow="hidden"
					boxSizing="border-box"
					position="relative"
				>
					{columns.map((s, index) => {
						const isToday = Array.from(dates.dates.values())[index].dateTime.hasSame(
							DateTime.now(),
							'day'
						);
						return (
							<Box
								key={index}
								gridRow={`1 / span ${state.project?.tasks.length ?? 1}`}
								gridColumn={`${index + 1}`}
								bg={isToday ? 'rgba(0, 0, 0, 0.05)' : undefined}
								borderLeftWidth={index === 0 ? 0 : '1px'}
								borderLeftColor={'#f4f5f6'}
							/>
						);
					})}
					{GridItemRows.map((row, index) => {
						const { start, end, color } = row;

						return (
							<Box
								as="span"
								key={index}
								borderTopLeftRadius={start === 1 ? 0 : '24px'}
								borderBottomLeftRadius={start === 1 ? 0 : '24px'}
								borderTopRightRadius={end >= dates.dates.size ? 0 : '24px'}
								borderBottomRightRadius={end >= dates.dates.size ? 0 : '24px'}
								style={{
									gridColumn: `${start} / ${start === end ? 'span 2' : end + 1}`,
									gridRow: `${index + 1}`,
									backgroundColor: color.backgroundColor
								}}
								padding="4px 8px"
								alignSelf="center"
								fontSize="14px"
								fontWeight="bold"
								cursor="pointer"
								boxShadow="0 0 0 rgba(0, 0, 0, 0)"
								transition="all 0.2s linear"
								border="1px solid transparent"
								_hover={{
									boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
									backgroundColor: '#fff !important',
									color: '#000 !important',
									borderColor: 'gray.200'
								}}
								onClick={row.onClick}
							>
								<Text isTruncated color={color.textColor}>
									{row.title}
								</Text>
							</Box>
						);
					})}
				</Grid>
			</GridItem>
		</>
	);
};
