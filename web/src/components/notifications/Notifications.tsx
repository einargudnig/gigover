import { BellIcon } from '@chakra-ui/icons';
import {
	Box,
	Flex,
	Heading,
	IconButton,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Notification as NotificationType, useNotifications } from '../../hooks/useNotifications';
import { useDeleteNotification } from '../../mutations/useDeleteNotification';
import { useReadNotification } from '../../mutations/useReadNotification';
import { timeSince } from '../../utils/TimeAndDateUtils';
import { Center } from '../Center';
import { LoadingSpinner } from '../LoadingSpinner';
import { CrossIcon } from '../icons/CrossIcon';
import { OpenTaskNotification } from './OpenTaskNotification';
import { useNavigate } from 'react-router';

export const Notifications = (): JSX.Element => {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const notifications = useNotifications();
	console.log('NOTIFICATIONS', notifications);

	return (
		<Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} closeOnBlur={true}>
			<PopoverTrigger>
				<IconButton
					colorScheme={'gray'}
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
				></IconButton>
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

const Notification = ({ data, onClick }: { data: NotificationType; onClick: () => void }) => {
	const [openTask, setOpenTask] = useState(false);
	const navigate = useNavigate();
	const readNotificationMutation = useReadNotification();
	const deleteNotificationMutation = useDeleteNotification();

	const openNotification = async () => {
		await readNotificationMutation.mutateAsync(data);
		// mark as read
		if (data.typeNotification === 'O' && data.orgId) {
			navigate('/settings');
			console.log('navigate');
		} else if (data.taskId) {
			// Open Task
			setOpenTask(true);
		}
		onClick();
	};

	const deleteNotification = async (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent openNotification from firing
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
				my={1}
				borderTop={'2px solid #f3f3f3'}
				py={2}
				align={'center'}
				cursor={'pointer'}
				onClick={openNotification}
				position="relative"
				_hover={{ '.delete-notification-icon': { display: 'block' } }}
			>
				{deleteNotificationMutation.isPending ? (
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
							<Box position="relative">
								<Text fontSize={'12px'} color={'gray.400'}>
									{timeSince(new Date(data.created))}
								</Text>
								<IconButton
									aria-label="Delete notification"
									icon={<CrossIcon size={16} />}
									size="xs"
									className={'delete-notification-icon'}
									position="absolute"
									top="-2px"
									right="-28px"
									p={1}
									cursor="pointer"
									display="none"
									transition="all 0.2s linear"
									onClick={deleteNotification}
									variant="ghost"
								/>
							</Box>
						</Flex>
						<Text fontSize={'14px'}>{data.text ?? 'Unknown content'}</Text>
					</Box>
				)}
			</Flex>
			{openTask && <OpenTaskNotification notification={data} />}
		</>
	);
};
