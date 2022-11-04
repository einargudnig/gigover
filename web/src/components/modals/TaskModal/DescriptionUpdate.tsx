import React, { useState } from 'react';
import { Task } from '../../../models/Task';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { Button, Tag, Textarea, VStack } from '@chakra-ui/react';

interface StatusUpdateProps {
	projectId: number;
	task: Task;
}

export const DescriptionUpdate = ({ task, projectId }: StatusUpdateProps): JSX.Element => {
	const { mutateAsync: updateTask, isLoading } = useUpdateTask(projectId);

	const [value, setValue] = useState(task.text);
	// const [editing, setEditing] = useState(false);
	const [showButton, setShowButton] = useState(false);

	// We want a function that shows the button when the user has typed something into the text area
	const handleChange = (event) => {
		setValue(event.target.value);
		setShowButton(true);
	};

	return (
		<div style={{ width: '100%' }}>
			<VStack mb={4} spacing={4} align={'start'}>
				<Tag>Description</Tag>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<Textarea value={value} onChange={handleChange} />
				)}{' '}
				{showButton ? (
					<Button
						onClick={() => {
							updateTask({ ...task, text: value });
							// setEditing(false);
						}}
						mt={2}
					>
						Save
					</Button>
				) : null}
			</VStack>
		</div>
	);
};
