import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	ButtonProps,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { useRef } from 'react';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
// import emailjs from '@emailjs/browser';

export type ConfirmDialogProps = {
	mutationLoading: boolean;
	mutation: () => void;
	buttonText: string;
	status: string;
	statusText?: string;
};

export const AnswerBid = ({
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
							<Text>{`Are you sure you want to ${status} this bid? You can't undo this action afterwards.`}</Text>
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
									// the mutations are defined in ClientAnswerId, but invoked here.
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
