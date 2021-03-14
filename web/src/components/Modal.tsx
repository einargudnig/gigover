import { IconButton } from '@chakra-ui/react';
import React, { FC, useCallback, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { useEventListener } from '../hooks/useEventListener';
import { CrossIcon } from './icons/CrossIcon';
import {
	CenterModalWrapper,
	ModalCloseCross,
	ModalContainerStyles,
	ModalContentContainer,
	ModalHeader,
	ModalOverlay,
	ModalTitleContainer,
	ModalWrapper
} from './ModalStyles';

const modalRoot = document.createElement('div');

const ModalRenderer = ({ children }: { children: React.ReactNode }) =>
	ReactDOM.createPortal(children, modalRoot);

export interface IModalContainerProps extends IWithFlexContainer {
	open: boolean;
	title?: string | React.ReactNode;
	children: React.ReactNode;
	onClose?: () => void;
	closeIcon?: boolean;
	centerModal?: boolean;
}

export interface IWithFlexContainer {
	/* If you want to flex the container it will fill the remaining space (used in mobile) */
	flexContainer?: boolean;
}

export const Modal: FC<IModalContainerProps> = ({
	open,
	flexContainer,
	title,
	onClose,
	children,
	centerModal = false,
	closeIcon = true
}: IModalContainerProps) => {
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

	useLayoutEffect(() => {
		modalRoot.className = 'gigover-modal-container';
		document.body.appendChild(modalRoot);
	}, []);

	const Wrapper = centerModal ? CenterModalWrapper : ModalWrapper;

	return open ? (
		<ModalRenderer>
			<ModalContainerStyles />
			<ModalOverlay>
				<Wrapper flexContainer={flexContainer}>
					<ModalHeader flexContainer={flexContainer}>
						<ModalTitleContainer>
							<span>{title}</span>
						</ModalTitleContainer>
						{onClose && closeIcon && (
							<ModalCloseCross>
								<IconButton
									aria-label={'Close modal'}
									colorScheme={'gray'}
									icon={<CrossIcon />}
									onClick={() => {
										closeModal();
									}}
								/>
							</ModalCloseCross>
						)}
					</ModalHeader>
					<ModalContentContainer flexContainer={flexContainer}>
						{children}
					</ModalContentContainer>
				</Wrapper>
			</ModalOverlay>
		</ModalRenderer>
	) : null;
};
