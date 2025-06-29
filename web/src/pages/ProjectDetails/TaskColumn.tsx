import { Button, Heading } from '@chakra-ui/react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities'; // For transform styles
import React, { useState } from 'react';
import { TaskCard } from '../../components/TaskCard';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { InputWrapper } from '../../components/forms/Input';
import { DragDropIcon } from '../../components/icons/DragDropIcons';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { useEventListener } from '../../hooks/useEventListener';
import { useGetUserPrivileges } from '../../hooks/useGetUserPrivileges';
import { Project } from '../../models/Project';
import { Task, TaskStatus, TaskStatusType } from '../../models/Task';
import { useAddTask } from '../../queries/useAddTask';
import { devError } from '../../utils/ConsoleUtils';
import { GetNextLexoRank } from '../../utils/GetNextLexoRank';

interface TaskColumnProps {
	project: Project;
	status: TaskStatusType;
	tasks: Task[];
}

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
	minHeight: 140,
	background: isDraggingOver ? '#e7f3ff' : 'transparent',
	borderRadius: 8,
	transition: 'background 0.2s',
	padding: 8
});

export const TaskColumn = ({ project, status, tasks }: TaskColumnProps) => {
	const [isCreatingTask, setIsCreatingTask] = useState(false);
	const [taskError, setTaskError] = useState<string>();
	const { privileges } = useGetUserPrivileges();
	const { mutateAsync: addTask, isPending: isLoading } = useAddTask();
	const taskStatus = Object.keys(TaskStatus).filter((value, index) => index === status)[0];

	const { setNodeRef: setDroppableNodeRef, isOver: isDroppableOver } = useDroppable({
		id: status.toString()
	});

	const createTask = async (taskValues: Pick<Task, 'typeId' | 'subject'>) => {
		try {
			const sortedTasks = [...tasks].sort((a, b) => a.lexoRank.localeCompare(b.lexoRank));
			const response = await addTask({
				...taskValues,
				lexoRank: GetNextLexoRank(sortedTasks, -1, sortedTasks.length).toString(),
				projectId: project.projectId,
				status
			});

			if (!response) {
				setTaskError('Could not create task');
				return;
			} else {
				setTaskError(undefined);
			}

			setIsCreatingTask(false);
		} catch (e) {
			devError(e);

			// @ts-ignore
			setTaskError(e.toString());
		}
	};

	useEventListener('keydown', (event) => {
		if (event.keyCode === 27) {
			setTaskError(undefined);
			setIsCreatingTask(false);
		}
	});

	return (
		<>
			<Heading size={'md'}>{taskStatus}</Heading>
			<div ref={setDroppableNodeRef} style={getListStyle(isDroppableOver)}>
				{tasks.map((task, taskIndex) => (
					<DraggableTask
						key={task.taskId}
						task={task}
						index={taskIndex}
						projectId={project.projectId}
						isDragDisabled={privileges?.includes('VIEWER')}
					/>
				))}
				{isCreatingTask && (
					<InputWrapper>
						<TaskCard
							error={taskError}
							loading={isLoading}
							projectId={project.projectId}
							onSubmit={(taskValues) => createTask(taskValues)}
						/>
					</InputWrapper>
				)}
			</div>
			<DisabledComponent>
				<Button
					colorScheme={'gray'}
					leftIcon={<PlusIcon style={{ margin: '0 8px 0 6px' }} size={14} />}
					variant={'outline'}
					onClick={() => setIsCreatingTask(true)}
				>
					Add task
				</Button>
			</DisabledComponent>
		</>
	);
};

// Helper component for Draggable Task
interface DraggableTaskProps {
	task: Task;
	index: number;
	projectId: number;
	isDragDisabled?: boolean;
}

const DraggableTask = ({ task, index, projectId, isDragDisabled }: DraggableTaskProps) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: task.taskId.toString(),
		data: {
			task,
			index,
			sortable: { index } // for GetNextLexoRank
		},
		disabled: isDragDisabled
	});

	const style: React.CSSProperties = {
		transform: CSS.Translate.toString(transform),
		transition: 'box-shadow 0.2s, background 0.2s, transform 0.2s',
		background: isDragging ? '#f0f4ff' : 'white',
		boxShadow: isDragging ? '0 4px 16px rgba(0,0,0,0.12)' : '0 1px 2px rgba(0,0,0,0.04)',
		borderRadius: 8,
		opacity: isDragging ? 0.85 : 1,
		display: 'flex',
		alignItems: 'center',
		marginBottom: 8,
		padding: 12,
		cursor: isDragDisabled ? 'not-allowed' : undefined
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<span
				{...listeners}
				style={{
					cursor: isDragDisabled ? 'not-allowed' : 'grab',
					marginRight: 12,
					display: 'flex',
					alignItems: 'center'
				}}
			>
				<DragDropIcon />
			</span>
			<TaskCard projectId={projectId} task={task} />
		</div>
	);
};
