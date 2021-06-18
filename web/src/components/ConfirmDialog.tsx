import React, { useRef } from 'react';
import {
	Button,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay
} from '@chakra-ui/react';
export const ConfirmDialog = ({
	isOpen,
	setIsOpen,
	callback,
	header,
	children
}: {
	isOpen: boolean;
	setIsOpen: (t: boolean) => void;
	callback: (s: boolean) => void;
	header: string;
	children: React.ReactNode;
}): JSX.Element => {
	const onClose = () => setIsOpen(false);
	const cancelRef = useRef<HTMLButtonElement | null>(null);

	return (
		<>
			{children}

			<AlertDialog
				portalProps={{ appendToParentPortal: true }}
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							{header}
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure? You can't undo this action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={() => callback(false)}>
								Cancel
							</Button>
							<Button colorScheme="red" onClick={() => callback(true)} ml={3}>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};
