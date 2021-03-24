import React, { useCallback } from 'react';
import { TaskCardInput } from '../../TaskCardInput';
import { Task, TaskStatus } from '../../../models/Task';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { Tag, VStack, HStack, Button, Box } from '@chakra-ui/react';

interface UpdateTaskComponentProps {
	task: Task;
	projectId: number;

	onChange(newValue: string): void;

	onClose(closeModal: boolean): void;
}

export const UpdateTaskComponent = ({
	task,
	projectId,
	onChange,
	onClose
}: UpdateTaskComponentProps): JSX.Element => {
	const { mutateAsync: updateTask, isLoading, error } = useUpdateTask(projectId);

	const archiveTask = async () => {
		await updateTask({
			taskId: task.taskId,
			typeId: task.typeId,
			text: task.text,
			status: TaskStatus.Archived
		});

		onClose(true);
	};

	const submitChanges = useCallback(
		async (newValue: Pick<Task, 'text' | 'typeId'>) => {
			await updateTask({
				status: task.status,
				taskId: task.taskId,
				typeId: newValue.typeId,
				text: newValue.text
			});

			onClose(true);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[task, updateTask]
	);

	return (
		<VStack spacing={8} alignItems={'flex-start'}>
			<div style={{ width: '100%' }}>
				<Tag mb={4}>Task details</Tag>
				<Box p={6} borderRadius={6} borderWidth="1px">
					<TaskCardInput
						task={task}
						value={task.text}
						error={error?.errorText}
						loading={isLoading}
						onChange={(newValue: string) => onChange(newValue)}
						onSubmit={(newValue: Pick<Task, 'text' | 'typeId'>) =>
							submitChanges(newValue)
						}
					/>
				</Box>
			</div>
			<VStack spacing={8} alignItems={'flex-start'}>
				<Tag>Actions</Tag>
				<HStack justifyContent={'space-between'}>
					<Button onClick={() => onClose(false)} colorScheme={'gray'}>
						Cancel & close
					</Button>
					<Button onClick={() => archiveTask()} colorScheme={'red'}>
						Archive this task
					</Button>
				</HStack>
			</VStack>
		</VStack>
	);
};
