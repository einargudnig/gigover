import { Avatar, Box, Flex, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { useContext } from 'react';
import { ModalContext } from '../context/ModalContext';
import { useGetUserPrivileges } from '../hooks/useGetUserPrivileges';
import { FileUploadType } from '../models/FileUploadType';
import { Task } from '../models/Task';
import { useProjectTypes } from '../queries/useProjectTypes';
import { DropZone } from './DropZone';
import { Label } from './Label';
import { TaskCardInput } from './TaskCardInput';

interface TaskProps {
	projectId: number;
	error?: string;
	loading?: boolean;
	task?: Task;
	onSubmit?: (taskValues: Pick<Task, 'typeId' | 'subject'>) => void;
}

export const TaskCard = ({
	task,
	projectId,
	onSubmit,
	loading = false,
	error
}: TaskProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { data } = useProjectTypes();
	const isEditing = Boolean(onSubmit);
	const { privileges, activeOrg } = useGetUserPrivileges();

	// couple of ways to control who can interact with the task card
	// ADMINS, EDITORS of organizations can interact with the task card
	// VIEWERS of ortanizations can only interact with the task card if the task is a broadcast type
	// if no organization is active, the user can interact with the task card
	const broadCastingtype = task?.typeId === 50;
	const isInteractable =
		privileges?.includes('ADMIN') ||
		privileges?.includes('EDITOR') ||
		!activeOrg ||
		broadCastingtype;

	if (!task && !onSubmit) {
		throw new Error('No task or onSubmit was supplied for Task Component');
	}

	const hoverBg = useColorModeValue('gray.100', 'gray.700');
	const dragActiveOutline = useColorModeValue('green.500', 'green.200');

	return (
		<DropZone
			offerId={0}
			tenderId={0}
			projectId={projectId}
			uploadType={FileUploadType.Task}
			externalId={task?.taskId}
		>
			{({ isDragActive }) => (
				<Tooltip
					hasArrow
					label={
						isInteractable
							? 'Click to open'
							: 'You do not have permission to open this task'
					}
					placement="top"
				>
					<Box
						bg="white"
						borderRadius="12px"
						transition="all 0.2s linear"
						boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
						p={{ base: 2, md: 3, lg: 4 }}
						m={2}
						cursor={isInteractable ? 'pointer' : 'not-allowed'}
						opacity={isInteractable ? 1 : 0.5}
						wordBreak="break-word"
						outline={isDragActive ? `3px solid ${dragActiveOutline}` : undefined}
						_hover={!isEditing ? { bg: hoverBg } : undefined}
						onClick={() =>
							isInteractable
								? isEditing
									? null
									: setModalContext({
											taskDetails: {
												task: task!,
												projectId: projectId
											}
									  })
								: null
						}
					>
						{task ? (
							<Box
								minH="70px"
								display="flex"
								justifyContent="space-between"
								flexDirection="column"
							>
								<Box
									as="h4"
									fontWeight="normal"
									fontSize={{ base: '14px', md: '15px', lg: '16px' }}
								>
									{task.subject}
								</Box>
								<Flex mt={4} align="center">
									<Label
										style={{ display: 'inline-block' }}
										text={
											data?.projectTypes.find(
												(pt) => pt.typeId === task?.typeId
											)?.name || 'unknown'
										}
									/>
									{task.worker && (
										<Avatar size="xs" ml={2} name={task.worker.name} />
									)}
								</Flex>
							</Box>
						) : (
							<TaskCardInput loading={loading} error={error} onSubmit={onSubmit} />
						)}
					</Box>
				</Tooltip>
			)}
		</DropZone>
	);
};
