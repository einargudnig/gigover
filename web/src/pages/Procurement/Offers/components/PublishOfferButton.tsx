import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	ButtonProps,
	Spacer,
	Text,
	useDisclosure,
	useToast
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { usePublishOffer } from '../../../../mutations/procurement/usePublishOffer';

export function PublishOfferButton({ tenderId, offerId, finishDateStatus }) {
	const { mutateAsync: publishOffer, isPending } = usePublishOffer();
	const toast = useToast();
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handlePublishOffer = async () => {
		const publishOfferBody = {
			offerId: offerId
		};

		try {
			await publishOffer(publishOfferBody);
			navigate(`/tender/my-offer/${tenderId}/${offerId}`);
			onClose();
		} catch (error) {
			console.log('ERROR', { error });
			toast({
				title: 'Error',
				description: 'Something went wrong when we tried to publish your offer.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
	};

	const handleOpenDialog: ButtonProps['onClick'] = (event) => {
		event.preventDefault();
		onOpen();
	};

	const cancelRef = useRef<HTMLButtonElement>(null);

	return (
		<>
			<Button
				variant={'outline'}
				colorScheme={'black'}
				onClick={handleOpenDialog}
				isDisabled={finishDateStatus}
			>
				Publish offer
			</Button>

			<AlertDialog
				isOpen={isOpen}
				onClose={onClose}
				leastDestructiveRef={cancelRef}
				portalProps={{ appendToParentPortal: true }}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>Publish Offer</AlertDialogHeader>

						<AlertDialogBody>
							<Text>Are you sure you want to publish this offer?</Text>
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button
								variant={'outline'}
								colorScheme={'gray'}
								ref={cancelRef}
								onClick={onClose}
							>
								Cancel
							</Button>
							<Spacer />
							<Button
								variant={'outline'}
								colorScheme={'black'}
								onClick={handlePublishOffer}
							>
								{isPending ? <LoadingSpinner /> : 'Publish offer'}
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}
