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
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogBody,
	Text,
	Spacer,
	useToast
} from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useAddOffer } from '../../../../mutations/useAddOffer';
import { useParams, useNavigate } from 'react-router-dom';

type OfferNote = {
	notes: string;
};

export const OpenOffer = (): JSX.Element => {
	const { tenderId } = useParams();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { register, handleSubmit } = useForm<OfferNote>();
	const { mutateAsync: addOffer, isLoading } = useAddOffer();

	const navigate = useNavigate();
	const toast = useToast();

	const onSubmit: SubmitHandler<OfferNote> = async (data: OfferNote) => {
		try {
			const body = {
				tenderId: Number(tenderId),
				notes: data.notes
			};

			// we can chain a .then() function to the end to receive the result of the mutation. In this case, we expect the result to be a number, which we can capture as the id parameter of the .then() function.
			const response = await addOffer(body).then((res) => res.data.id);

			// Before this was { id: 33 } because the AxiosResponse was of type AxiosResponse<{ id: number }>
			// Changed it to be of type AxiosResponse<number> and returned response.data.id in the mutation.
			const offerId = response;

			if (offerId !== 0) {
				navigate(`/tender/offers/${Number(tenderId)}/${offerId}`);
				console.log('Offer opened! With id: ', offerId);
				toast({
					title: 'Offer opened!',
					description:
						'You have opened an offer! Start to add numbers, cost and notes to the items.',
					status: 'success',
					duration: 3000,
					isClosable: true
				});
			} else {
				console.log('Cannot open offer with offerId: ', offerId);
				toast({
					title: 'Invalid tender!',
					description: `You cannot open an offer with offerId as ${offerId}. The tender is not valid.`,
					status: 'error',
					duration: 3000,
					isClosable: true
				});
			}

			onClose();
			console.log('Offer opened!');
		} catch (e) {
			console.log(e);
			toast({
				title: 'Invalid tender!',
				description: 'You cannot open an offer. There is an error.',
				status: 'error',
				duration: 3000,
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
									<FormControl id={'note'}>
										<FormLabel>Note</FormLabel>
										<Input
											{...register('notes')}
											placeholder={
												"Do you want to add any notes? e.g. 'You can reach me at this hours.'"
											}
										/>
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
								<Button type="submit">
									{isLoading ? <LoadingSpinner /> : 'Open offer'}
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</form>
			</AlertDialog>
		</>
	);
};
