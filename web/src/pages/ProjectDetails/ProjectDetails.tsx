import { Box, Flex, Heading } from '@chakra-ui/react';
import { DndContext, DragOverlay, closestCenter, useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Label } from '../../components/Label';
import { DragDropIcon } from '../../components/icons/DragDropIcons';
import { TaskStatus } from '../../models/Task';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { useProjectTypes } from '../../queries/useProjectTypes';
import { useUpdateTask } from '../../queries/useUpdateTask';
import { GetNextLexoRank } from '../../utils/GetNextLexoRank';

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
		const cols = {};
		for (const status of columnOrder) {
			cols[status] = tasks
				.filter((t) => t.status.toString() === status)
				.sort((a, b) => (a.lexoRank && b.lexoRank ? (a.lexoRank > b.lexoRank ? 1 : -1) : 0))
				.map((t) => ({ id: t.taskId.toString(), name: t.subject, type: t.typeId }));
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

		// Find the real task object
		const realTask = data?.project?.tasks.find((t) => t.taskId.toString() === active.id);
		if (!realTask) {
			setActiveTask(null);
			setActiveColumn(null);
			return;
		}

		// Prepare destination column's real tasks, sorted by lexoRank
		const destTasks = (data?.project?.tasks || [])
			.filter((t) => t.status.toString() === toColumn)
			.sort((a, b) => (a.lexoRank && b.lexoRank ? (a.lexoRank > b.lexoRank ? 1 : -1) : 0));

		// Remove the task if moving between columns
		const destTasksForRank: typeof destTasks = fromColumn === toColumn ? destTasks : destTasks;
		if (fromColumn !== toColumn) {
			// If moving between columns, the task is not in destTasks yet
			// so toIndex is correct
		}

		// Calculate new lexoRank
		const nextRank = GetNextLexoRank(
			destTasksForRank,
			fromColumn === toColumn ? fromIndex : -1,
			toIndex
		);

		// Update local columns optimistically
		if (fromColumn === toColumn) {
			const newColumn = arrayMove(columns[fromColumn], fromIndex, toIndex);
			setColumns({ ...columns, [fromColumn]: newColumn });
		} else {
			const task = columns[fromColumn][fromIndex];
			const newFrom = [...columns[fromColumn]];
			newFrom.splice(fromIndex, 1);
			const newTo = [...columns[toColumn]];
			newTo.splice(toIndex, 0, task);
			setColumns({ ...columns, [fromColumn]: newFrom, [toColumn]: newTo });
		}

		// Persist the change
		updateTask.mutate({
			taskId: realTask.taskId,
			status: parseInt(toColumn) as typeof realTask.status,
			subject: realTask.subject,
			text: realTask.text,
			lexoRank: nextRank.toString(),
			typeId: realTask.typeId
		});

		setActiveTask(null);
		setActiveColumn(null);
	};

	// Find the active task object for the overlay
	const allTasks = Object.values(columns).flat() as {
		id: string;
		name: string;
		type?: string | number;
	}[];
	const activeTaskObj = allTasks.find((t) => t.id === activeTask);

	if (isPending) return <Box p={4}>Loading...</Box>;
	if (isError) return <Box p={4}>Error: {error?.errorText}</Box>;

	return (
		<Box p={4}>
			<DndContext
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<Flex gap={4} alignItems="flex-start">
					{columnOrder.map((colKey) => (
						<KanbanColumn
							key={colKey}
							columnId={colKey}
							title={columnTitles[colKey]}
							tasks={columns[colKey]}
							activeTask={activeTask}
						/>
					))}
				</Flex>
				<DragOverlay>
					{activeTaskObj ? (
						<KanbanTaskCard
							id={activeTaskObj.id}
							name={activeTaskObj.name}
							index={0}
							columnId={activeColumn}
							isActive={true}
							type={activeTaskObj.type}
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</Box>
	);
};

const KanbanColumn = ({ columnId, title, tasks, activeTask }) => {
	const { setNodeRef, isOver } = useDroppable({ id: columnId });
	return (
		<Box minW="220px" bg="#f7f7fa" borderRadius={8} p={3} boxShadow="sm">
			<Heading size="sm" mb={3}>
				{title}
			</Heading>
			<div
				ref={setNodeRef}
				style={{
					minHeight: 40,
					background: isOver ? '#e0e7ff' : undefined,
					borderRadius: 6,
					transition: 'background 0.2s'
				}}
			>
				<SortableContext
					items={tasks.map((t) => t.id)}
					strategy={verticalListSortingStrategy}
				>
					{tasks.length === 0 ? (
						<Box textAlign="center" color="gray.400" py={4}>
							{isOver ? 'Release to drop here' : 'No tasks'}
						</Box>
					) : (
						tasks.map((task, idx) => (
							<KanbanTaskCard
								key={task.id}
								id={task.id}
								name={task.name}
								index={idx}
								columnId={columnId}
								isActive={activeTask === task.id}
								type={task.type}
							/>
						))
					)}
				</SortableContext>
			</div>
		</Box>
	);
};

const KanbanTaskCard = ({ id, name, index, columnId, isActive, type }) => {
	const { data: projectTypesData } = useProjectTypes();
	const typeName =
		typeof type === 'number'
			? projectTypesData?.projectTypes.find((pt) => pt.typeId === type)?.name || 'unknown'
			: 'unknown';
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		data: { columnId, index }
	});
	const style: React.CSSProperties = {
		position: 'relative',
		transform: CSS.Transform.toString(transform),
		transition,
		background: isDragging ? '#e0e7ff' : 'white',
		borderRadius: 8,
		boxShadow: isDragging ? '0 4px 16px rgba(0,0,0,0.12)' : '0 1px 2px rgba(0,0,0,0.04)',
		opacity: isDragging ? 0.85 : 1,
		marginBottom: 8,
		padding: '12px 36px 12px 12px',
		cursor: 'default',
		fontWeight: isActive ? 600 : 400,
		border: isActive ? '2px solid #6366f1' : '1px solid #e5e7eb'
	};
	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<span style={{ position: 'absolute', top: 8, right: 8, cursor: 'grab' }} {...listeners}>
				<DragDropIcon />
			</span>
			<div>{name}</div>
			<div style={{ marginTop: 4 }}>
				<Label text={typeName} />
			</div>
		</div>
	);
};
