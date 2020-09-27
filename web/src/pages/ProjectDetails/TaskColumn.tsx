import React, { useState } from 'react';
import { Project } from '../../models/Project';
import { Task, TaskStatus, TaskStatusType } from '../../models/Task';
import { useModifyTask } from '../../queries/useModifyTask';
import { Button } from '../../components/forms/Button';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { TaskCard } from '../../components/TaskCard';
import { InputWrapper } from '../../components/forms/Input';
import { useEventListener } from '../../hooks/useEventListener';

interface TaskColumnProps {
	project: Project;
	status: TaskStatusType;
}

export const TaskColumn = ({ project, status }: TaskColumnProps) => {
	const [isCreatingTask, setIsCreatingTask] = useState(false);
	const [addTask, { isLoading, isError, error }] = useModifyTask();
	const taskStatus = Object.keys(TaskStatus).filter((value, index) => index === status)[0];

	const tasks = project.tasks?.filter((task) => task.status === status) ?? [];

	const createTask = async (taskValues: Pick<Task, 'typeId' | 'text'>) => {
		await addTask({
			...taskValues,
			projectId: project.projectId,
			status
		});

		setIsCreatingTask(false);
	};

	useEventListener('keydown', (event) => {
		if (event.keyCode === 27) {
			setIsCreatingTask(false);
		}
	});

	return (
		<>
			<h3>{taskStatus}</h3>
			{tasks.length > 0 && (
				<div>
					{tasks.map((task) => (
						<TaskCard key={task.taskId} task={task} />
					))}
				</div>
			)}
			{isCreatingTask && (
				<InputWrapper>
					<TaskCard onSubmit={(taskValues) => createTask(taskValues)} />
				</InputWrapper>
			)}
			<Button size={'fill'} appearance={'lightblue'} onClick={() => setIsCreatingTask(true)}>
				<PlusIcon style={{ margin: '0 8px 0 6px' }} size={14} />
				<span>Add task</span>
			</Button>
		</>
	);
};
