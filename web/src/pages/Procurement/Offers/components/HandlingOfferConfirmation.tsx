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

export type ConfirmDialogProps = {
	mutationLoading: boolean;
	mutation: () => void;
	buttonText: string;
	status: string;
	statusText?: string;
};

export const HandlingOfferConfirmation = ({
	mutationLoading,
	mutation,
	buttonText,
	status,
	statusText
}: ConfirmDialogProps): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<HTMLButtonElement | null>(null);

	const handleOpenDialog: ButtonProps['onClick'] = (event) => {
		event.preventDefault();
		onOpen();
	};

	return (
		<>
			<Button onClick={handleOpenDialog} mt={'4'}>
				{mutationLoading ? <LoadingSpinner /> : statusText}
			</Button>

			<AlertDialog
				isOpen={isOpen}
				onClose={onClose}
				leastDestructiveRef={cancelRef}
				portalProps={{ appendToParentPortal: true }}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>{`${statusText}`}</AlertDialogHeader>
						<AlertDialogBody>
							<Text>{`Are you sure you want to ${status} this offer? You can't undo this action afterwards.`}</Text>
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
									mutation();
									// Add toast, dynamically?
									onClose();
								}}
								ml={3}
							>
								{`${buttonText}`}
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};
