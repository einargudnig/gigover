import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/forms/Input';
import { TimeTrackerInput } from '../../queries/useTrackerStart';
import { useTrackerStop } from '../../queries/useTrackerStop';

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
	const { mutateAsync: stopTask, isPending } = useTrackerStop();

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
			<Box>
				<Text mt={-2} mb={4}>
					Do you want to stop this timer?
				</Text>
				<Input
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder={'Add comment'}
				/>
				<Flex mt={6} justifyContent={'space-between'}>
					<Button onClick={onClose} colorScheme={'gray'} isLoading={isPending}>
						Cancel
					</Button>
					<Button onClick={onConfirm} isLoading={isPending}>
						Stop timer
					</Button>
				</Flex>
			</Box>
		</Modal>
	);
};
