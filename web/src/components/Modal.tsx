import React, { FC, useCallback, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle, css } from 'styled-components';
import { useEventListener } from '../hooks/useEventListener';
import { CrossIcon } from './icons/CrossIcon';

const MODAL_PADDING = '24px';

const ModalContainerStyles = createGlobalStyle`
    .gigover-modal-container {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        height: 100%;
        width: 100%;
        z-index: 9999;
        transform: translate3d(0,0,0);
    }
`;

const ModalHeader = styled.div<IWithFlexContainer>`
	width: 100%;
	position: sticky;
	background: #fff;
	top: 0;
	z-index: 1;
	padding: 32px 24px 16px;
	margin-bottom: 24px;
	user-select: none;

	${(props) =>
		props.flexContainer &&
		css`
			flex-shrink: 1;
		`}

	// Disgusting safari issue, needs extra padding.
    ${navigator &&
	/^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
	css`
		padding: 32px ${MODAL_PADDING};

		@media screen and (max-width: 576px) {
			padding: ${MODAL_PADDING} 16px;
		}
	`}
`;

const ModalTitleContainer = styled.div`
	max-width: calc(100% - 32px);

	span {
		max-width: 100%;
		font-size: 24px;
		font-weight: bold;
		color: #000;
	}
`;

const ModalOverlay = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	overflow-y: hidden;
	align-items: center;
	justify-content: flex-end;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.3);
	-webkit-overflow-scrolling: touch;

	@media screen and (max-width: 800px) {
		align-items: flex-end;
	}

	@keyframes fadeOutAnimationOverlay {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
`;

const ModalWrapper = styled.div<IWithFlexContainer>`
	background: #fff;
	box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
	min-width: 800px;
	max-width: 90vw;
	height: 100vh;
	overflow-y: auto;
	overflow-x: hidden;
	border-radius: 0;
	position: relative;
	will-change: opacity, transform, bottom;
	animation-name: fadeInModalWrapper;
	animation-duration: 250ms;
	animation-fill-mode: none;
	animation-timing-function: ease-out;
	animation-play-state: running;
	animation-iteration-count: 1;
	transform: translate3d(0, 0, 0);
	-webkit-overflow-scrolling: touch;

	${(props) =>
		props.flexContainer &&
		css`
			display: flex;
			flex-direction: column;
		`};

	@keyframes fadeInModalWrapper {
		0% {
			transform: translate3d(100%, 0, 0) scale(1);
		}

		100% {
			transform: translate3d(0, 0, 0) scale(1);
		}
	}

	@keyframes fadeOutModalWrapper {
		0% {
			transform: translate3d(0, 0, 0) scale(1);
			opacity: 1;
		}

		100% {
			transform: translate3d(0, 0, 0) scale(0.6);
			opacity: 0;
		}
	}

	@media screen and (max-width: 800px) {
		width: 100%;
		min-width: auto;
		max-width: 100%;
		max-height: none;
		height: 85%; // Do not use viewport height here, it's inconsistent between ios/android
		overflow-y: auto;
		animation-duration: 300ms;
		animation-name: fadeInModalWrapperMobile;
		border-radius: unset;
	}

	@keyframes fadeInModalWrapperMobile {
		from {
			transform: translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes fadeOutModalWrapperMobile {
		from {
			transform: translateY(0);
			opacity: 1;
		}

		to {
			transform: translateY(100%);
			opacity: 0;
		}
	}
`;

const ModalCloseCross = styled.div`
	position: absolute;
	top: 24px;
	right: 24px;
	cursor: pointer;
`;

const ModalContentContainer = styled.div<IWithFlexContainer>`
	position: relative;
	padding: ${MODAL_PADDING} ${MODAL_PADDING};
	margin-top: -${MODAL_PADDING};
	transform: translate3d(0, 0, 0);
	-webkit-overflow-scrolling: touch;

	${(props) =>
		props.flexContainer &&
		css`
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			justify-content: space-between;
		`};

	@media screen and (max-width: 800px) {
		padding: 16px;
	}
`;

const modalRoot = document.createElement('div');

const ModalRenderer = ({ children }: { children: React.ReactNode }) =>
	ReactDOM.createPortal(children, modalRoot);

export interface IModalContainerProps extends IWithFlexContainer {
	open: boolean;
	title?: string;
	children: React.ReactNode;
	onClose?: () => void;
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
	children
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

	return open ? (
		<ModalRenderer>
			<ModalContainerStyles />
			<ModalOverlay>
				<ModalWrapper flexContainer={flexContainer}>
					<ModalHeader flexContainer={flexContainer}>
						<ModalTitleContainer>
							<span>{title}</span>
						</ModalTitleContainer>
						{onClose && (
							<ModalCloseCross
								onClick={() => {
									closeModal();
								}}
							>
								<CrossIcon />
							</ModalCloseCross>
						)}
					</ModalHeader>
					<ModalContentContainer flexContainer={flexContainer}>
						{children}
					</ModalContentContainer>
				</ModalWrapper>
			</ModalOverlay>
		</ModalRenderer>
	) : null;
};
