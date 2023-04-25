import React, { useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
	Button,
	ButtonProps,
	useDisclosure,
	VStack,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogBody,
	Text,
	Spacer
} from '@chakra-ui/react';
import { useAddOffer } from '../../../../mutations/useAddOffer';
import { useParams } from 'react-router-dom';

type OfferNote = {
	note: string;
};

export const OpenOffer = (): JSX.Element => {
	const { tenderId } = useParams();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<OfferNote>();
	const { mutateAsync: addOffer } = useAddOffer();

	const onSubmit: SubmitHandler<OfferNote> = async (data: OfferNote) => {
		try {
			const body = {
				tenderId: Number(tenderId),
				note: data.note
			};

			const response = await addOffer(body);
			// const offerId = response.data?.data?.offerId;
			console.log(response);

			onClose();
			console.log('Offer opened!');
		} catch (e) {
			console.log(e);
		}
	};

	const handleOpenDialog: ButtonProps['onClick'] = (event) => {
		event.preventDefault();
		onOpen();
	};

	const cancelRef = useRef<HTMLButtonElement>(null);
	return (
		<>
			<Button onClick={handleOpenDialog}>Open Offer</Button>

			<AlertDialog
				isOpen={isOpen}
				onClose={onClose}
				leastDestructiveRef={cancelRef}
				portalProps={{ appendToParentPortal: true }}
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<AlertDialogOverlay>
						<AlertDialogContent>
							<AlertDialogHeader>Add notes with your offer</AlertDialogHeader>

							<AlertDialogBody>
								<VStack spacing={4}>
									<Text>
										You can add notes to the offer. You need to open the offer
										so you can start making offers to items.
									</Text>
									<FormControl id={'email'} isInvalid={!errors.note}>
										<FormLabel>Note</FormLabel>
										<Input
											{...register('note')}
											placeholder={
												"Do you want to add any notes? e.g. 'You can reach me at this hours..'"
											}
										/>

										<FormErrorMessage>{errors.note?.message}</FormErrorMessage>
									</FormControl>
								</VStack>
							</AlertDialogBody>
							<AlertDialogFooter>
								<Button
									variant={'outline'}
									colorScheme={'black'}
									ref={cancelRef}
									onClick={onClose}
								>
									Cancel
								</Button>
								<Spacer />
								<Button type="submit">Open offer</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</form>
			</AlertDialog>
		</>
	);
};
