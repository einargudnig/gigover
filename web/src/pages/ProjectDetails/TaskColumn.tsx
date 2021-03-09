import React, { useMemo, useState } from 'react';
import { Project } from '../../models/Project';
import { Task, TaskStatus, TaskStatusType } from '../../models/Task';
import { useAddTask } from '../../queries/useAddTask';
import { Button } from '../../components/forms/Button';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { TaskCard } from '../../components/TaskCard';
import { InputWrapper } from '../../components/forms/Input';
import { useEventListener } from '../../hooks/useEventListener';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { devError } from '../../utils/ConsoleUtils';

interface TaskColumnProps {
	project: Project;
	status: TaskStatusType;
}

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
	minHeight: 140,
	background: !isDraggingOver ? 'transparent' : '#e7fff3'
});

export const TaskColumn = ({ project, status }: TaskColumnProps) => {
	const [isCreatingTask, setIsCreatingTask] = useState(false);
	const [taskError, setTaskError] = useState<string>();
	const { mutateAsync: addTask, isLoading } = useAddTask();
	const taskStatus = Object.keys(TaskStatus).filter((value, index) => index === status)[0];

	const tasks = useMemo(() => {
		return (
			project.tasks
				?.sort((a, b) => (a.priority < b.priority ? -1 : 1))
				.filter((task) => task.status === status) ?? []
		);
	}, [project.tasks, status]);

	const createTask = async (taskValues: Pick<Task, 'typeId' | 'text'>) => {
		try {
			const response = await addTask({
				...taskValues,
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
			setTaskError(e);
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
			<h3>{taskStatus}</h3>
			<Droppable droppableId={status.toString()}>
				{(droppable, snapshot) => (
					<div
						{...droppable.droppableProps}
						style={getListStyle(snapshot.isDraggingOver)}
						ref={droppable.innerRef}
					>
						{tasks.map((task, taskIndex) => (
							<Draggable
								key={taskIndex}
								draggableId={task.taskId.toString()}
								index={status + taskIndex + task.priority}
							>
								{(provided): JSX.Element => (
									<div
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
									>
										<TaskCard projectId={project.projectId} task={task} />
									</div>
								)}
							</Draggable>
						))}
						{droppable.placeholder}
					</div>
				)}
			</Droppable>

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

			<Button size={'fill'} appearance={'lightblue'} onClick={() => setIsCreatingTask(true)}>
				<PlusIcon style={{ margin: '0 8px 0 6px' }} size={14} />
				<span>Add task</span>
			</Button>
		</>
	);
};
