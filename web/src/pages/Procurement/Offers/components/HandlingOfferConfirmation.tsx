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
	email: string;
};

export const HandlingOfferConfirmation = ({
	mutationLoading,
	mutation,
	buttonText,
	status,
	statusText,
	offerId,
	email
}: ConfirmDialogProps): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<HTMLButtonElement | null>(null);

	const handleOpenDialog: ButtonProps['onClick'] = (event) => {
		event.preventDefault();
		onOpen();
	};

	const emailServiceId = process.env.REACT_APP_EMAIL_SERVICE_ID;
	const emailTemplateId = process.env.REACT_APP_EMAIL_OFFER_TEMPLATE_ID; //TODO make a new template
	const emailUserId = 'yz_BqW8_gSHEh6eAL'; // this is a public key, so no reason to have it in .env

	const handling = {
		accept: 'accept',
		reject: 'reject'
	};
	const offerStatus = handling[status];
	// I want to send an email to the bidder when the offer is accepted or rejected
	// send an email to the bidder
	const sendEmail = async () => {
		const templateParams = {
			offerId: offerId,
			to_email: email,
			status: offerStatus
		};

		try {
			await emailjs
				.send(emailServiceId!, emailTemplateId!, templateParams!, emailUserId!)
				.then(
					function (response) {
						console.log('SUCCESS!', response.status, response.text);
					},
					function (error) {
						console.log('FAILED...', error);
					}
				);

			onClose();
		} catch (e) {
			console.log(e);
		}
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
