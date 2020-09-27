import React, { useState } from 'react';
import { Project } from '../../models/Project';
import { Task, TaskStatus, TaskStatusType } from '../../models/Task';
import { useModifyTask } from '../../queries/useModifyTask';
import { Button } from '../../components/forms/Button';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { TaskCard } from '../../components/TaskCard';

interface TaskColumnProps {
	project: Project;
	status: TaskStatusType;
}

export const TaskColumn = ({ project, status }: TaskColumnProps) => {
	const [isCreatingTask, setIsCreatingTask] = useState(false);
	const [addTask, { data, isLoading, isError, error }] = useModifyTask(project.projectId);
	const taskStatus = Object.keys(TaskStatus).filter((value, index) => index === status)[0];

	const createTask = async (taskValues: Pick<Task, 'typeId' | 'text'>) => {
		await addTask({
			...taskValues,
			projectId: project.projectId,
			status
		});
	};

	return (
		<>
			<h3>{taskStatus}</h3>
			<div>
				<TaskCard
					task={{
						text: 'Test',
						taskId: 1,
						projectId: project.projectId,
						comments: [],
						minutes: 524,
						status,
						typeId: 1
					}}
				/>
			</div>
			{isCreatingTask && (
				<div>
					<TaskCard onSubmit={(taskValues) => createTask(taskValues)} />
				</div>
			)}
			<Button size={'fill'} appearance={'lightblue'} onClick={() => setIsCreatingTask(true)}>
				<PlusIcon style={{ margin: '0 8px 0 6px' }} size={14} />
				<span>Add task</span>
			</Button>
		</>
	);
};
