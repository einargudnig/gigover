import React, { useState } from 'react';
import { Task, TaskStatus, TaskStatusType } from '../../../models/Task';
import { TrackerSelect } from '../../TrackerSelect';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { Button, HStack, Tag, Textarea, Text } from '@chakra-ui/react';

interface StatusUpdateProps {
	projectId: number;
	task: Task;
}

export const DescriptionUpdate = ({ task, projectId }: StatusUpdateProps): JSX.Element => {
	const { mutateAsync: updateTask, isLoading } = useUpdateTask(projectId);

	const [value, setValue] = useState(task.text);
	const [editing, setEditing] = useState(false);

	return (
		<div style={{ width: '100%' }}>
			<HStack mb={4} spacing={4} justifyContent={'space-between'}>
				<Tag>Description</Tag>
				<Button variant={'outline'} size={'sm'} onClick={() => setEditing(!editing)}>
					{editing ? 'Close' : 'Edit'}
				</Button>
				{isLoading && <LoadingSpinner />}
			</HStack>

			{editing ? (
				<div>
					<Textarea value={value} onChange={(s) => setValue(s.target.value)} />{' '}
					<Button
						onClick={() => {
							updateTask({ ...task, text: value });
							setEditing(false);
						}}
						mt={2}
					>
						Save
					</Button>
				</div>
			) : (
				<Text>{value}</Text>
			)}
		</div>
	);
};
