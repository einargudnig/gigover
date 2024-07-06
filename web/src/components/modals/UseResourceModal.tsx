import { HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { ResourceTrackerContext } from '../../context/ModalContext';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { Task } from '../../models/Task';
import { SubstringText } from '../../utils/StringUtils';
import { displayTaskTitle } from '../../utils/TaskUtils';
import { TrackerSelect } from '../TrackerSelect';
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
					label: SubstringText(displayTaskTitle(task), 70),
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
