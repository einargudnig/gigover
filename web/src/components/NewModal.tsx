import {
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure
} from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useEventListener } from '../hooks/useEventListener';
import { VerticalDots } from './icons/VerticalDots';

const modalRoot = document.createElement('div');

const ModalRenderer = ({ children }) => ReactDOM.createPortal(children, modalRoot);

export interface IModalContainerProps {
	open: boolean;
	title?: string | React.ReactNode;
	children: React.ReactNode;
	onClose?: () => void;
	closeIcon?: boolean;
	centerModal?: boolean;
	maxWidth?: number;
}

export const ModalComponent: FC<IModalContainerProps> = ({
	open,
	title,
	onClose,
	children,
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
		<Modal
			isOpen={isOpen}
			onClose={chakraOnClose}
			size={centerModal ? 'xl' : 'full'}
			isCentered={centerModal}
		>
			<ModalOverlay />
			<ModalContent maxWidth={maxWidth ? `${maxWidth}px` : '90vw'}>
				<ModalHeader>
					{title}
					<IconButton aria-label="More" icon={<VerticalDots />} variant="ghost" />
					{closeIcon && <ModalCloseButton onClick={closeModal} />}
				</ModalHeader>
				<ModalBody>{children}</ModalBody>
			</ModalContent>
		</Modal>
	);
};
