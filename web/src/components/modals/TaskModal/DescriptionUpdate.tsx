import { Button, Tag, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { Task } from '../../../models/Task';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { LoadingSpinner } from '../../LoadingSpinner';

interface StatusUpdateProps {
	projectId: number;
	task: Task;
}

export const DescriptionUpdate = ({ task, projectId }: StatusUpdateProps): JSX.Element => {
	const { mutateAsync: updateTask, isLoading } = useUpdateTask(projectId);

	const [value, setValue] = useState(task.text);
	// const [editing, setEditing] = useState(false);
	const [isToLong, setIsToLong] = useState(false);
	const [showButton, setShowButton] = useState(false);

	const toast = useToast();

	// We want a function that shows the button when the user has typed something into the text area
	const handleChange = (event) => {
		setValue(event.target.value);
		setIsToLong(event.target.value.length > 600);
		setShowButton(true);
	};

	return (
		<div style={{ width: '100%' }}>
			<VStack mb={4} spacing={4} align={'start'}>
				<Tag>Description</Tag>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<Textarea
						value={value}
						onChange={handleChange}
						placeholder="Write a description for this task"
						colorScheme={'gray'}
						size={'md'}
						variant={'outline'}
						isInvalid={isToLong}
						errorBorderColor={'red.300'}
					/>
				)}{' '}
				{showButton ? (
					<Button
						onClick={() => {
							if (isToLong) {
								toast({
									title: 'Description is too long',
									description: 'Please keep it under 600 characters',
									status: 'error',
									duration: 5000,
									isClosable: true
								});
							} else {
								updateTask({ ...task, text: value });
							}

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
