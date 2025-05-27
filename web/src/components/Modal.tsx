import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay
} from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';

export interface IModalContainerProps {
	open: boolean;
	title?: string | React.ReactNode;
	children: React.ReactNode;
	onClose?: () => void;
	closeIcon?: boolean;
	centerModal?: boolean;
	maxWidth?: number | string;
	flexContainer?: boolean;
}

export const Modal: FC<IModalContainerProps> = ({
	open,
	title,
	onClose,
	children,
	centerModal = false,
	closeIcon = true,
	maxWidth: propMaxWidth,
	flexContainer
}: IModalContainerProps) => {
	const closeModal = useCallback(() => {
		if (onClose) {
			onClose();
		}
	}, [onClose]);

	const finalMaxWidth = typeof propMaxWidth === 'number' ? `${propMaxWidth}px` : propMaxWidth;

	return open ? (
		<Drawer isOpen={open} onClose={closeModal} size={'lg'}>
			<DrawerOverlay bg="rgba(0, 0, 0, 0.3)" />
			<DrawerContent
				bg="#fff"
				boxShadow="0 5px 25px rgba(0,0,0,0.1)"
				maxWidth={finalMaxWidth}
			>
				{onClose && closeIcon && <DrawerCloseButton top="24px" right="24px" />}

				{title && (
					<DrawerHeader
						pt="32px"
						px="24px"
						pb="16px"
						fontSize="24px"
						fontWeight="bold"
						userSelect="none"
					>
						{title}
					</DrawerHeader>
				)}

				<DrawerBody
					px="24px"
					pt={title ? '24px' : '32px'}
					pb="24px"
					display={flexContainer ? 'flex' : 'block'}
					flexDirection={flexContainer ? 'column' : undefined}
					flexGrow={flexContainer ? 1 : undefined}
					justifyContent={flexContainer && children ? 'space-between' : undefined}
				>
					{children}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	) : null;
};
