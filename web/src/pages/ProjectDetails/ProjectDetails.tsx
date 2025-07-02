import { Box, Flex } from '@chakra-ui/react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Task } from '../../models/Task';
import { TaskStatus } from '../../models/Task';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { useUpdateTask } from '../../queries/useUpdateTask';
import { GetNextLexoRank } from '../../utils/GetNextLexoRank';
import KanbanColumn from './KanbanColumn';
import KanbanTaskCard from './KanbanTaskCard';

// Dynamically build columns from TaskStatus (excluding Archived)
const statusEntries = Object.entries(TaskStatus).filter(
	([key, value]) => value !== TaskStatus.Archived
);
const columnOrder = statusEntries.map(([key, value]) => value.toString());
const columnTitles = Object.fromEntries(
	statusEntries.map(([key, value]) => [value.toString(), key])
);

export const ProjectDetails = () => {
	const { projectId } = useParams();
	const projectIdNumber = parseInt(projectId as string);
	const { data, isPending, isError, error } = useProjectDetails(projectIdNumber);
	const updateTask = useUpdateTask(projectIdNumber);

	// Build columns from real tasks
	const tasks = data?.project?.tasks || [];
	const buildColumns = () => {
		const cols: { [key: string]: Task[] } = {};
		for (const status of columnOrder) {
			cols[status] = tasks
				.filter((t) => t.status.toString() === status)
				.sort((a, b) => a.lexoRank.localeCompare(b.lexoRank));
		}
		return cols;
	};
	const [columns, setColumns] = useState(buildColumns());
	const [activeTask, setActiveTask] = useState(null);
	const [activeColumn, setActiveColumn] = useState(null);

	// Update columns when tasks change
	useEffect(() => {
		setColumns(buildColumns());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tasks.length]);

	const handleDragStart = (event) => {
		setActiveTask(event.active.id);
		setActiveColumn(event.active.data.current?.columnId);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over) {
			setActiveTask(null);
			setActiveColumn(null);
			return;
		}

		const fromColumn = active.data.current?.columnId;
		const fromIndex = active.data.current?.index;
		let toColumn = over.data.current?.columnId;
		let toIndex = over.data.current?.index;

		// If dropped on an empty column, over.id is the column id
		if (columnOrder.includes(over.id)) {
			toColumn = over.id;
			toIndex = 0;
		}

		if (!fromColumn || !toColumn) {
			setActiveTask(null);
			setActiveColumn(null);
			return;
		}

		// Find the real task object by ID
		const taskId = active.id;
		const realTask = tasks.find((t) => t.taskId.toString() === taskId);
		if (!realTask) {
			setActiveTask(null);
			setActiveColumn(null);
			return;
		}

		// Prepare destination column's real tasks, sorted by lexoRank and deduplicated
		let destTasks = tasks
			.filter((t) => t.status.toString() === toColumn)
			.sort((a, b) => a.lexoRank.localeCompare(b.lexoRank));
		// Deduplicate by lexoRank, keeping the first occurrence
		const seen = new Set();
		destTasks = destTasks.filter((t) => {
			if (seen.has(t.lexoRank)) return false;
			seen.add(t.lexoRank);
			return true;
		});

		// Calculate new lexoRank for the destination position
		const adjustedToIndex =
			fromColumn === toColumn && fromIndex < toIndex ? toIndex - 1 : toIndex;
		const nextRank = GetNextLexoRank(
			destTasks,
			fromColumn === toColumn ? fromIndex : -1,
			adjustedToIndex
		);

		// Build new columns state optimistically
		const newColumns = { ...columns };
		// Remove from old column
		newColumns[fromColumn] = newColumns[fromColumn].filter((t) => t.taskId !== realTask.taskId);
		// Insert into new column at the correct position
		const updatedTask = {
			...realTask,
			status: parseInt(toColumn) as import('../../models/Task').TaskStatusType,
			lexoRank: nextRank.toString()
		};
		newColumns[toColumn] = [
			...newColumns[toColumn].slice(0, toIndex),
			updatedTask,
			...newColumns[toColumn].slice(toIndex)
		];

		setColumns(newColumns);
		console.log('Columns after move:', JSON.stringify(newColumns, null, 2));
		Object.entries(newColumns).forEach(([col, tasks]) => {
			console.log(`Column ${col}:`);
			tasks.forEach((t, i) =>
				console.log(`  ${i + 1}: id=${t.taskId}, lexoRank=${t.lexoRank}`)
			);
		});

		// Persist the change
		updateTask.mutate({
			taskId: realTask.taskId,
			status: parseInt(toColumn) as import('../../models/Task').TaskStatusType,
			subject: realTask.subject,
			text: realTask.text,
			lexoRank: nextRank.toString(),
			typeId: realTask.typeId
		});

		setActiveTask(null);
		setActiveColumn(null);
	};

	// Find the active task object for the overlay
	const allTasks = Object.values(columns).flat() as Task[];
	const activeTaskObj = allTasks.find((t) => t.taskId.toString() === activeTask);

	if (isPending) return <Box p={4}>Loading...</Box>;
	if (isError) return <Box p={4}>Error: {error?.errorText}</Box>;

	return (
		<Box p={4}>
			<DndContext
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<Flex gap={4} alignItems="flex-start" width="100%" overflowX="auto">
					{columnOrder.map((colKey) => (
						<KanbanColumn
							key={colKey}
							columnId={colKey}
							title={columnTitles[colKey]}
							tasks={columns[colKey]}
							activeTask={activeTask}
							projectId={projectIdNumber}
						/>
					))}
				</Flex>
				<DragOverlay>
					{activeTaskObj ? (
						<KanbanTaskCard
							task={activeTaskObj}
							projectId={projectIdNumber}
							index={0}
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</Box>
	);
};
