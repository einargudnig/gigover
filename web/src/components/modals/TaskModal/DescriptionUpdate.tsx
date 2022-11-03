import React, { useState } from 'react';
import { Task } from '../../../models/Task';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { Button, HStack, Tag, Text, Textarea, VStack } from '@chakra-ui/react';

interface StatusUpdateProps {
	projectId: number;
	task: Task;
}

export const DescriptionUpdate = ({ task, projectId }: StatusUpdateProps): JSX.Element => {
	const { mutateAsync: updateTask, isLoading } = useUpdateTask(projectId);

	const [value, setValue] = useState(task.text);
	const [editing, setEditing] = useState(false);

	return (
		// 	<div style={{ width: '100%' }}>
		// 		<HStack mb={4} spacing={4} justifyContent={'space-between'}>
		// 			<Tag>Description</Tag>
		// 			<Button variant={'outline'} size={'sm'} onClick={() => setEditing(!editing)}>
		// 				{editing ? 'Close' : 'Edit'}
		// 			</Button>
		// 			{isLoading && <LoadingSpinner />}
		// 		</HStack>

		// 		{editing ? (
		// 			<div>
		// 				<Textarea value={value} onChange={(s) => setValue(s.target.value)} />{' '}
		// 				<Button
		// 					onClick={() => {
		// 						updateTask({ ...task, text: value });
		// 						setEditing(false);
		// 					}}
		// 					mt={2}
		// 				>
		// 					Save
		// 				</Button>
		// 			</div>
		// 		) : (
		// 			<Text>{value}</Text>
		// 		)}
		// 	</div>
		// );

		<div style={{ width: '100%' }}>
			<VStack mb={4} spacing={4} align={'start'}>
				<Tag>Description</Tag>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<Textarea value={value} onChange={(s) => setValue(s.target.value)} />
				)}{' '}
				{editing ? null : (
					<Button
						onClick={() => {
							updateTask({ ...task, text: value });
							setEditing(false);
							setValue(value);
						}}
						mt={2}
					>
						Save
					</Button>
				)}
			</VStack>
		</div>
	);
};
