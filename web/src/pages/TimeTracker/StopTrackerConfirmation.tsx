import React, { useCallback, useState } from 'react';
import { TimeTrackerInput } from '../../queries/useTrackerStart';
import { useTrackerStop } from '../../queries/useTrackerStop';
import { Input } from '../../components/forms/Input';
import { Modal } from '../../components/Modal';
import { Button, Flex, Text } from '@chakra-ui/react';

export interface StopTrackerConfirmationProps extends TimeTrackerInput {
	onClose: () => void;
	onComplete: () => void;
}

export const StopTrackerConfirmation = ({
	projectId,
	taskId,
	uId,
	onClose,
	onComplete
}: StopTrackerConfirmationProps): JSX.Element => {
	const [comment, setComment] = useState('');
	const { mutateAsync: stopTask, isLoading } = useTrackerStop();

	const onConfirm = useCallback(async () => {
		await stopTask({
			projectId,
			taskId,
			uId,
			comment
		});

		onComplete();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectId, taskId, uId, comment, onComplete]);

	return (
		<Modal open={true} centerModal={true} title={'Stop time tracking'} onClose={onClose}>
			<div>
				<Text mt={-2} mb={4}>
					Do you want to stop this timer?
				</Text>
				<Input
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder={'Add comment'}
				/>
				<Flex mt={6} justifyContent={'space-between'}>
					<Button onClick={onClose} colorScheme={'gray'} isLoading={isLoading}>
						Cancel
					</Button>
					<Button onClick={onConfirm} isLoading={isLoading}>
						Stop timer
					</Button>
				</Flex>
			</div>
		</Modal>
	);
};
