import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react';
import { DndContext, DragOverlay, closestCenter, useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Label } from '../../components/Label';
import { DragDropIcon } from '../../components/icons/DragDropIcons';
import { ModalContext } from '../../context/ModalContext';
import type { Task } from '../../models/Task';
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
		const cols: { [key: string]: Task[] } = {};
		for (const status of columnOrder) {
			cols[status] = tasks
				.filter((t) => t.status.toString() === status)
				.sort((a, b) =>
					a.lexoRank && b.lexoRank ? (a.lexoRank > b.lexoRank ? 1 : -1) : 0
				);
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
						<KanbanTaskCard task={activeTaskObj} projectId={projectIdNumber} />
					) : null}
				</DragOverlay>
			</DndContext>
		</Box>
	);
};

const KanbanColumn = ({
	columnId,
	title,
	tasks,
	activeTask,
	projectId
}: {
	columnId: string;
	title: string;
	tasks: Task[];
	activeTask: string | null;
	projectId: number;
}) => {
	const { setNodeRef, isOver } = useDroppable({ id: columnId });
	return (
		<Box flex={1} minW="220px" bg="#f7f7fa" borderRadius={8} p={3} boxShadow="sm">
			<Flex>
				<Heading size="sm" mb={3}>
					{title}
				</Heading>
				<Text ml={2} size="sm" mb={3}>
					({tasks.length})
				</Text>
			</Flex>
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
					items={tasks.map((t) => t.taskId.toString())}
					strategy={verticalListSortingStrategy}
				>
					{tasks.length === 0 ? (
						<Box textAlign="center" color="gray.400" py={4}>
							{isOver ? 'Release to drop here' : 'No tasks'}
						</Box>
					) : (
						tasks.map((task) => (
							<KanbanTaskCard task={task} key={task.taskId} projectId={projectId} />
						))
					)}
				</SortableContext>
			</div>
		</Box>
	);
};

const KanbanTaskCard = ({ task, projectId }: { task: Task; projectId: number }) => {
	const { taskId, subject, typeId, worker } = task;
	const id = taskId.toString();
	const name = subject;
	const type = typeId;
	const [, setModalContext] = useContext(ModalContext);
	const { data: projectTypesData } = useProjectTypes();
	const typeName =
		typeof type === 'number'
			? projectTypesData?.projectTypes.find((pt) => pt.typeId === type)?.name || 'unknown'
			: 'unknown';
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		data: { columnId: task.status.toString(), index: 0 }
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
		padding: 12,
		cursor: 'pointer',
		fontWeight: 600,
		border: isDragging ? '2px solid #6366f1' : '1px solid #e5e7eb',
		minHeight: 80,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between'
	};
	// Open modal on card click, but not when clicking the drag icon
	const handleCardClick = (e: React.MouseEvent) => {
		if ((e.target as HTMLElement).closest('.drag-handle')) return;
		setModalContext({
			taskDetails: {
				projectId: projectId,
				task: task
			}
		});
	};
	return (
		<div ref={setNodeRef} style={style} {...attributes} onClick={handleCardClick}>
			{/* Top row: name left, drag icon right */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start'
				}}
			>
				<div style={{ fontWeight: 600, fontSize: 15, wordBreak: 'break-word' }}>{name}</div>
				<span
					className="drag-handle"
					style={{ cursor: 'grab', marginLeft: 8 }}
					{...listeners}
				>
					<DragDropIcon />
				</span>
			</div>
			{/* Bottom row: type label left, avatar right */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-end',
					marginTop: 12
				}}
			>
				<Label text={typeName} />
				{worker && worker.name && <Avatar size="xs" name={worker.name} />}
			</div>
		</div>
	);
};
