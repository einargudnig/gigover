import { Box, Button, Tag, Text, VStack } from '@chakra-ui/react';
import { useCallback } from 'react';
import { Task } from '../../../models/Task';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { TaskCardInput } from '../../TaskCardInput';

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

	const submitChanges = useCallback(
		async (newValue: Pick<Task, 'subject' | 'typeId'>) => {
			await updateTask({
				...task,
				typeId: newValue.typeId,
				subject: newValue.subject
			});

			onClose(true);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[task, updateTask]
	);

	return (
		<VStack spacing={4} alignItems={'flex-start'}>
			<div style={{ width: '100%' }}>
				<Tag mb={4}>Task details</Tag>
				<Box p={4} borderRadius={6} borderWidth="1px">
					<TaskCardInput
						task={task}
						value={task.subject}
						error={error?.errorText}
						loading={isLoading}
						onChange={(newValue: string) => onChange(newValue)}
						onSubmit={(newValue: Pick<Task, 'subject' | 'typeId'>) =>
							submitChanges(newValue)
						}
					/>
				</Box>
			</div>
			<div>
				<Text>
					You can edit the task name and type in the box above. Make sure you press save
					after you have made the changes
				</Text>
			</div>
			<div>
				<Button onClick={() => onClose(false)} colorScheme={'gray'}>
					Cancel & close
				</Button>
			</div>
		</VStack>
	);
};
