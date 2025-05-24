import { Button, HStack, Tag, Text, VStack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { Task } from '../../../models/Task';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { TaskCardInput } from '../../TaskCardInput';

interface UpdateTaskComponentProps {
	task: Task;
	projectId: number;
	onChange: (newValue: string) => void;
	onClose: () => void;
}

export const UpdateTaskComponent = ({
	task,
	projectId,
	onChange,
	onClose
}: UpdateTaskComponentProps): JSX.Element => {
	const { mutateAsync: updateTask, isPending, error } = useUpdateTask(projectId);

	const [tempValue, setTempValue] = useState<string | undefined>(task.subject);

	const submitChanges = useCallback(
		async (taskValues: Pick<Task, 'subject' | 'typeId'>) => {
			await updateTask({
				...task,
				...taskValues
			});
		},
		[task, updateTask]
	);

	const handleUpdate = useCallback(async () => {
		if (tempValue !== task.subject) {
			await submitChanges({
				subject: tempValue as string,
				typeId: task.typeId
			});
			onClose();
		}
	}, [tempValue, task.subject, submitChanges, onClose]);

	return (
		<VStack w="100%" alignItems="flex-start">
			<HStack mb={4} spacing={4} justifyContent={'space-between'}>
				<Tag>Update task component</Tag>
			</HStack>
			<Text>Task Name</Text>
			<TaskCardInput
				task={task}
				value={tempValue ?? ''}
				error={error?.errorText}
				loading={isPending}
				onChange={(newValue: string) => {
					setTempValue(newValue);
					onChange(newValue);
				}}
				onSubmit={(newValue: Pick<Task, 'subject' | 'typeId'>) => submitChanges(newValue)}
			/>
			<div>
				<Button
					variant={'solid'}
					colorScheme={'green'}
					onClick={handleUpdate}
					disabled={isPending || !tempValue}
					isLoading={isPending}
				>
					Save
				</Button>
			</div>
		</VStack>
	);
};
