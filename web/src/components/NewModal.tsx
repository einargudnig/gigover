import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	IconButton,
	useDisclosure
} from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';
import { useEventListener } from '../hooks/useEventListener';
import { VerticalDots } from './icons/VerticalDots';

export interface IModalContainerProps {
	open: boolean;
	title?: string | React.ReactNode;
	onClose?: () => void;
	closeIcon?: boolean;
	centerModal?: boolean;
	maxWidth?: number;
}

export const NewModalComponent: FC<IModalContainerProps> = ({
	open,
	title,
	onClose,
	centerModal = false,
	closeIcon = true,
	maxWidth
}) => {
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
		<Drawer isOpen={isOpen} onClose={chakraOnClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton onClick={() => closeModal()} />
				<DrawerHeader>
					{title}
					<IconButton aria-label="More" icon={<VerticalDots />} variant="ghost" />
				</DrawerHeader>
				<DrawerBody>New modal</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
