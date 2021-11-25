import React, { useMemo, useState } from 'react';
import { Project } from '../../models/Project';
import { Task, TaskStatus, TaskStatusType } from '../../models/Task';
import { useAddTask } from '../../queries/useAddTask';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { TaskCard } from '../../components/TaskCard';
import { InputWrapper } from '../../components/forms/Input';
import { useEventListener } from '../../hooks/useEventListener';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { devError } from '../../utils/ConsoleUtils';
import { Button, Heading } from '@chakra-ui/react';
import { LexoRank } from 'lexorank';

interface TaskColumnProps {
	project: Project;
	status: TaskStatusType;
	tasks: Task[];
}

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
	minHeight: 140,
	background: !isDraggingOver ? 'transparent' : '#e7fff3'
});

export const TaskColumn = ({ project, status, tasks }: TaskColumnProps) => {
	const [isCreatingTask, setIsCreatingTask] = useState(false);
	const [taskError, setTaskError] = useState<string>();
	const { mutateAsync: addTask, isLoading } = useAddTask();
	const taskStatus = Object.keys(TaskStatus).filter((value, index) => index === status)[0];

	const createTask = async (taskValues: Pick<Task, 'typeId' | 'subject'>) => {
		try {
			const response = await addTask({
				...taskValues,
				lexoRank: tasks[tasks.length - 1]?.lexoRank
					? LexoRank.parse(tasks[tasks.length - 1].lexoRank ?? '')
							.genNext()
							.toString()
					: LexoRank.middle().toString(),
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
			<Droppable droppableId={status.toString()}>
				{(droppable, snapshot) => (
					<div
						{...droppable.droppableProps}
						style={getListStyle(snapshot.isDraggingOver)}
						ref={droppable.innerRef}
					>
						{tasks.map((task, taskIndex) => (
							<Draggable
								key={task.taskId}
								draggableId={task.taskId.toString()}
								index={taskIndex}
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
				)}
			</Droppable>
			<Button
				colorScheme={'gray'}
				leftIcon={<PlusIcon style={{ margin: '0 8px 0 6px' }} size={14} />}
				variant={'outline'}
				onClick={() => setIsCreatingTask(true)}
			>
				Add task
			</Button>
		</>
	);
};
