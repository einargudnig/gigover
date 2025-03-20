import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Text,
	VStack,
	useToast
} from '@chakra-ui/react';
import emailjs from '@emailjs/browser';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Theme } from '../../Theme';
import { useCloseModal } from '../../hooks/useCloseModal';
import { Bid } from '../../models/Tender';
import { useAddBid } from '../../mutations/procurement/client-bids/useAddBid';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';
import { devError } from '../../utils/ConsoleUtils';
import { FormActions } from '../FormActions';
import { DatePicker } from '../forms/DatePicker';

interface BidModalProps {
	bid?: Bid;
}

export const AddBidModal = ({ bid }: BidModalProps): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const [uId, setUId] = useState('');
	const [inviteSuccess, setInviteSuccess] = useState(false); // use this to update the ui
	const searchMutation = useGetUserByEmail();
	//
	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				console.log('Found user with uId:', response.uId);
				// find a clientUid for the client
				setUId(response.uId);
				setInviteSuccess(true);
			} else {
				toast({
					title: 'User not found!',
					description: 'The user was not found, We have sent an email to the user.',
					status: 'error',
					duration: 5000,
					isClosable: true
				});
				sendEmailNoAccount();
			}
			// setInviteSuccess(false);
		} catch (e) {
			devError(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);
	console.log({ uId });

	// For the email we send if the user does not have a gigOver account.
	const emailServiceId = process.env.REACT_APP_EMAIL_SERVICE_ID;
	const emailTemplateId = process.env.REACT_APP_EMAIL_CLIENT_BID_TEMPLATE_ID;
	const emailUserId = 'yz_BqW8_gSHEh6eAL'; // this is a public key, so no reason to have it in .env

	// We send an email to ask the user to create a gigOver account if he doesn't have one.
	const sendEmailNoAccount = async () => {
		const templateParams = {
			bidDesc: bid?.description,
			to_email: searchMail
		};
		console.log('Sending email to: ', searchMail);
		console.log('propertyName: ', templateParams.bidDesc);
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
		} catch (e) {
			console.log(e);
		}
	};

	const closeModal = useCloseModal();

	const toast = useToast();

	const { mutate: addBid, isError, error } = useAddBid();
	const { register, control, handleSubmit } = useForm<Bid>({
		defaultValues: bid,
		mode: 'onBlur'
	});

	// For the checkbox
	const [isChecked, setIsChecked] = useState<number>(0);
	const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked ? 1 : 0;
		setIsChecked(newValue);
	};

	const onSubmit = handleSubmit(
		async ({ description, terms, address, finishDate, clientUId, notes }) => {
			console.log(description, terms, address, finishDate, isChecked, clientUId, notes);
			try {
				const response = addBid({
					clientUId: uId, // this comes from the search function
					description,
					terms,
					address,
					finishDate,
					delivery: isChecked,
					notes
				});
				console.log('response', response);

				closeModal();
			} catch (e) {
				devError('Error', e);
				toast({
					title: 'Invalid bid!',
					description: 'You could not add the Bid! There is an error.',
					status: 'error',
					duration: 3000,
					isClosable: true
				});
			}
		}
	);

	return (
		<div>
			{isError && (
				<>
					{/* Server errors */}
					<p>{error?.errorText}</p>
					<small>{error?.errorCode}</small>
				</>
			)}
			<form onSubmit={onSubmit}>
				<VStack mb={-6} align={'stretch'}>
					<Text>Here you can create a bid and send to the bidder.</Text>

					<Flex justifyContent={'flex-start'}>
						<VStack>
							<Text>
								The client has to have a Gigover accont. Add his Gigover account
								email.
							</Text>

							<FormControl>
								<FormLabel>Client email</FormLabel>
								<HStack>
									<Input
										required={true}
										{...register('clientUId')}
										value={searchMail}
										onChange={(e) => setSearchMail(e.target.value)}
									/>
									<Button
										onClick={search}
										isLoading={searchMutation.isLoading}
										isDisabled={
											searchMutation.isLoading || searchMutation.isError
										}
									>
										Invite
									</Button>
								</HStack>
								{inviteSuccess ? (
									<>
										<Text mt={3} mb={4} color={Theme.colors.green}>
											User found - You can create bid!
										</Text>

										<FormControl id={'description'}>
											<FormLabel>Description</FormLabel>
											<Input
												required={true}
												{...register('description', {
													required: 'Bid description is required'
												})}
											/>
										</FormControl>
										<Box mb={6} />
										<FormControl id={'terms'}>
											<FormLabel>Terms</FormLabel>
											<Input
												required={true}
												{...register('terms', {
													required: 'Terms are required'
												})}
											/>
										</FormControl>
										<FormControl id={'address'}>
											<FormLabel>Address</FormLabel>
											<Input
												required={true}
												{...register('address', {
													required: 'Address is required'
												})}
											/>
										</FormControl>
										<Box mb={6} />
										<FormControl id={'delivery'}>
											<FormLabel>Delivery</FormLabel>
											<Checkbox
												name="delivery"
												isChecked={isChecked === 1}
												onChange={handleChangeCheckbox}
											/>
										</FormControl>
										<Box mb={6} />
										<FormControl id={'finishDate'}>
											<FormLabel>Bid valid through</FormLabel>
											<Controller
												name="finishDate"
												control={control}
												render={({
													field: { onChange, onBlur, value }
												}) => (
													<DatePicker
														onChange={(date) => {
															if (date) {
																onChange((date as Date).getTime());
															} else {
																onChange(null);
															}
														}}
														selected={value ? new Date(value) : null}
														onBlur={onBlur}
														required={true}
													/>
												)}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>
												Other - want to add something more?
											</FormLabel>
											<Input {...register('notes', {})} />
										</FormControl>
									</>
								) : null}
							</FormControl>
						</VStack>
					</Flex>

					<FormActions
						submitDisabled={searchMutation.isLoading || searchMutation.isError}
						cancelText={'Cancel'}
						onCancel={closeModal}
						submitText={'Create'}
						onSubmit={onSubmit}
					/>
				</VStack>
			</form>
		</div>
	);
};
