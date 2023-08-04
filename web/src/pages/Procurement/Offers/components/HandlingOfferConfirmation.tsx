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
import emailjs from '@emailjs/browser';

export type ConfirmDialogProps = {
	mutationLoading: boolean;
	mutation: () => void;
	buttonText: string;
	status: string;
	statusText?: string;
	offerId: number;
};

export const HandlingOfferConfirmation = ({
	mutationLoading,
	mutation,
	buttonText,
	status,
	statusText,
	offerId
}: ConfirmDialogProps): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<HTMLButtonElement | null>(null);

	const handleOpenDialog: ButtonProps['onClick'] = (event) => {
		event.preventDefault();
		onOpen();
	};

	const acceptOfferText = 'Your offer has been accepted!';
	const rejectOfferText = 'Your offer has been rejected!';
	// send an email to the bidder
	// const sendEmail = async () => {
	// 	const templateParams = {
	// 		offerId: offerId,
	// 		to_email:
	// 	}
	// }

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
							<Text>{`Are you sure you want to ${status} this offer? You can't undo this action afterwards. An email will be sent to the bidder notifying him.`}</Text>
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
									// the mutations are defined in PublishOffers, but invoked here.
									// This makes it so we can re-use this component for both accept and reject.
									mutation();
									// sendEmail();
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
