import {
	Box,
	Flex,
	Heading,
	Button,
	IconButton,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Notification as NotificationType, useNotifications } from '../../hooks/useNotifications';
import { useReadNotification } from '../../mutations/useReadNotification';
import { OpenTaskNotification } from './OpenTaskNotification';
import { timeSince } from '../../utils/TimeAndDateUtils';
import { BellIcon } from '@chakra-ui/icons';
import { useDeleteNotification } from '../../mutations/useDeleteNotification';
import styled from '@emotion/styled';
import { CrossIcon } from '../icons/CrossIcon';
import { LoadingSpinner } from '../LoadingSpinner';
import { Center } from '../Center';

export const Notifications = (): JSX.Element => {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const notifications = useNotifications();

	return (
		<Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} closeOnBlur={true}>
			<PopoverTrigger>
				{/* <IconButton
					colorScheme={'yellow'}
					aria-label={'Notifications'}
					icon={
						<>
							{notifications.unread > 0 && (
								<Flex
									align={'center'}
									justify={'center'}
									bg={'red.500'}
									borderRadius={'200px'}
									position={'absolute'}
									bottom={'-4px'}
									right={'-4px'}
									height={'16px'}
									width={'16px'}
								>
									<Box color={'white'} fontSize={'10px'} fontWeight={'bold'}>
										{notifications.unread}
									</Box>
								</Flex>
							)}
							<BellIcon />
						</>
					}
				></IconButton> */}
				<div>
					<Button>Notifications</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent width={'400px'}>
				<Box p={6}>
					<Heading mb={4} fontSize={'18px'}>
						Notifications
					</Heading>
					<Box width={'100%'} height={'400px'} overflow={'scroll'}>
						{notifications.notifications.map((s) => (
							<Notification data={s} key={s.id} onClick={() => onClose()} />
						))}
					</Box>
				</Box>
			</PopoverContent>
		</Popover>
	);
};

const StyledFlex = styled.div`
	position: relative;

	.delete-notification-icon {
		position: absolute;
		top: 28px;
		right: -6px;
		padding: 6px;
		cursor: pointer;
		display: none;
		transition: all 0.2s linear;
	}

	&:hover {
		.delete-notification-icon {
			display: block;
		}
	}
`;

const Notification = ({ data, onClick }: { data: NotificationType; onClick: () => void }) => {
	const [openTask, setOpenTask] = useState(false);
	const readNotificationMutation = useReadNotification();
	const deleteNotificationMutation = useDeleteNotification();

	const openNotification = async () => {
		// mark as read
		if (data.taskId) {
			await readNotificationMutation.mutateAsync(data);

			// Open Task
			setOpenTask(true);
			onClick();
		}
	};

	const deleteNotification = async () => {
		await deleteNotificationMutation.mutateAsync(data);
	};

	useEffect(() => {
		// Unload
		return () => {
			setOpenTask(false);
		};
	}, []);

	return (
		<>
			<Flex
				as={StyledFlex}
				my={1}
				borderTop={'2px solid #f3f3f3'}
				py={2}
				align={'center'}
				cursor={'pointer'}
				onClick={openNotification}
			>
				{deleteNotificationMutation.isLoading ? (
					<Center>
						<LoadingSpinner />
					</Center>
				) : (
					<Box flex={1}>
						<Flex justify={'space-between'}>
							<Text
								fontWeight={data.status === 0 ? 'bold' : 'normal'}
								color={'black'}
								fontSize={'12px'}
							>
								{data.subject ?? 'Unknown name'}
							</Text>
							<div>
								<Text fontSize={'12px'} color={'gray.400'}>
									{timeSince(new Date(data.created))}
								</Text>
								<div
									className={'delete-notification-icon'}
									onClick={() => deleteNotification()}
								>
									<CrossIcon size={16} />
								</div>
							</div>
						</Flex>
						<Text fontSize={'14px'}>{data.text ?? 'Unknown content'}</Text>
					</Box>
				)}
			</Flex>
			{openTask && <OpenTaskNotification notification={data} />}
		</>
	);
};
