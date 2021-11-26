import React, { useState } from 'react';
import { TrackerSelect } from '../TrackerSelect';
import { Task } from '../../models/Task';
import { SubstringText } from '../../utils/StringUtils';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { ResourceTrackerContext } from '../../context/ModalContext';
import { HStack } from '@chakra-ui/react';
import { UseResourceOnTask } from './TaskModal/UseResourceOnTask';

export const UseResourceModal = ({
	resourceTracker
}: {
	resourceTracker: ResourceTrackerContext;
}): JSX.Element => {
	const project = resourceTracker.project;
	const tasks: Task[] = useProjectTasks(project);
	const [selectedTask, setSelectedTask] = useState<Task | undefined>();

	return (
		<>
			<p>1. Select task in {project.name}</p>
			<TrackerSelect
				title={'Select a task'}
				value={selectedTask?.taskId}
				options={tasks.map((task) => ({
					label: SubstringText(task.subject ?? task.text ?? '', 70),
					value: task.taskId
				}))}
				isNumber={true}
				valueChanged={(newValue) => {
					if (!newValue) {
						setSelectedTask(undefined);
					} else {
						const taskId = newValue as number;
						setSelectedTask(tasks.find((t) => t.taskId === taskId)!);
					}
				}}
			/>
			{selectedTask && (
				<HStack spacing={2}>
					<UseResourceOnTask task={{ ...selectedTask, projectId: project.projectId }} />
				</HStack>
			)}
		</>
	);
};
