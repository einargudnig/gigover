import React, { useRef } from 'react';
import {
	Button,
	ButtonProps,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';

export const ConfirmDialog = ({ mutationLoading, mutation, buttonText }: { mut }): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<HTMLButtonElement | null>(null);

	const handleOpenDialog: ButtonProps['onClick'] = (event) => {
		event.preventDefault();
		onOpen();
	};

	return (
		<>
			<Button onClick={handleOpenDialog} mt={'4'}>
				{mutationLoading ? <LoadingSpinner /> : { buttonText }}
			</Button>

			<AlertDialog
				isOpen={isOpen}
				onClose={onClose}
				leastDestructiveRef={cancelRef}
				portalProps={{ appendToParentPortal: true }}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>Publish offer</AlertDialogHeader>
						<AlertDialogBody>
							<Text>Are you sure you want to publish this offer?</Text>
							<Text>You cannot update the offer after publishing.</Text>
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button
								ref={cancelRef}
								onClick={onClose}
								variant={'outline'}
								colorScheme={'gray'}
							>
								Cancel
							</Button>
							<Button
								onClick={() => {
									// ! mutation
									mutation;
									onClose();
								}}
								ml={3}
							>
								Publish
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};
