import {
	Box,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	IconButton,
	Spacer,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useDisclosure
} from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';
import { useEventListener } from '../hooks/useEventListener';
import { Task } from '../models/Task';
import { CrossIcon } from './icons/CrossIcon';
import { VerticalDots } from './icons/VerticalDots';

export interface TaskModalProps {
	open: boolean;
	title?: string | React.ReactNode;
	onClose?: () => void;
	projectId: number;
	task: Task;
}

export const NewModalComponent: FC<TaskModalProps> = ({ open, title, onClose }) => {
	const { isOpen, onOpen, onClose: chakraOnClose } = useDisclosure({ isOpen: open });

	const closeModal = useCallback(() => {
		if (onClose) {
			onClose();
		}
	}, [onClose]);

	useEventListener('keydown', (event) => {
		if (event.keyCode === 27) {
			closeModal();
		}
	});

	return (
		<Drawer isOpen={isOpen} onClose={chakraOnClose} size="lg">
			<DrawerOverlay />
			<DrawerContent>
				<Flex direction={'column'}>
					<Flex alignItems={'center'}>
						<Box>
							<DrawerHeader>{title}</DrawerHeader>
						</Box>
						<Spacer />
						<Box>
							<Flex alignItems={'center'} mr="4">
								<IconButton
									aria-label="More"
									icon={<VerticalDots />}
									variant="ghost"
								/>
								<IconButton
									aria-label="Close"
									icon={<CrossIcon />}
									variant="ghost"
									onClick={() => closeModal()}
								/>
								{/* <DrawerCloseButton onClick={() => closeModal()} /> */}
							</Flex>
						</Box>
					</Flex>
					<DrawerBody>
						<Tabs colorScheme="black">
							<TabList>
								<Tab>Details</Tab>
								<Tab>Comments</Tab>
							</TabList>

							<TabPanels>
								<TabPanel>Details</TabPanel>
								<TabPanel>Comments</TabPanel>
							</TabPanels>
						</Tabs>
					</DrawerBody>
				</Flex>
			</DrawerContent>
		</Drawer>
	);
};
