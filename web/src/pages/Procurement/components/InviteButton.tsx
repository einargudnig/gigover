import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useInviteBidder } from '../../../mutations/useInviteBidder';
import { useGetUserByEmail } from '../../../queries/useGetUserByEmail';
import { devError, devInfo } from '../../../utils/ConsoleUtils';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Theme } from '../../../Theme';
import emailjs from '@emailjs/browser';
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

type InviteEmail = {
	email: string;
};

export const InviteButton = ({ tenderId, tenderDesc }): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const [inviteSuccess, setInviteSuccess] = useState(false);
	const inviteMutation = useInviteBidder();
	const searchMutation = useGetUserByEmail();
	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				devInfo('Found user with uId:', response.uId);
				// Add to tender
				inviteMutation.mutateAsync({ uId: response.uId, tenderId }).then((res) => {
					if (res.errorCode === 'OK') {
						setSearchMail('');
						setInviteSuccess(true);
					} else {
						throw new Error('Could not invite user.');
					}
				});
			}
		} catch (e) {
			//
			devError(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);

	useEffect(() => {
		if (inviteSuccess) {
			setTimeout(() => {
				setInviteSuccess(false);
			}, 3500);
		}
	}, [inviteSuccess]);
	// For the email we send if the user does not have a gigOver account.
	const emailServiceId = process.env.REACT_APP_EMAIL_SERVICE_ID;
	const emailTemplateId = process.env.REACT_APP_EMAIL_TEMPLATE_ID;
	const emailUserId = 'yz_BqW8_gSHEh6eAL'; // this is a public keu, so no reason to have it in .env

	// console.log('tenderDesc in Button: ', tenderDesc);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<InviteEmail>();

	const onSubmit: SubmitHandler<InviteEmail> = async (data: InviteEmail) => {
		const templateParams = {
			tenderDesc,
			to_email: data.email
		};
		console.log('Sending email to: ', data.email);
		// console.log('tenderDesc: ', templateParams.tenderDesc);
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

	const handleOpenDialog: ButtonProps['onClick'] = (event) => {
		event.preventDefault();
		onOpen();
	};

	const cancelRef = useRef<HTMLButtonElement | null>(null);
	return (
		<>
			<Button ml={'1'} onClick={handleOpenDialog}>
				Invite User
			</Button>

			<AlertDialog
				isOpen={isOpen}
				onClose={onClose}
				leastDestructiveRef={cancelRef}
				portalProps={{ appendToParentPortal: true }}
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<AlertDialogOverlay>
						<AlertDialogContent>
							<AlertDialogHeader>Invite user with email</AlertDialogHeader>

							<AlertDialogBody>
								<VStack spacing={4}>
									<Text>
										Invite a user to this tender. If the user does not have a
										GigOver account, he will receive an email asking him to
										create one. Note that you will need to invite him again
										after he has created the account.
									</Text>
									<FormControl
										isRequired={true}
										isInvalid={searchMutation.isError || inviteMutation.isError}
										mb={4}
									>
										<FormLabel htmlFor={'inviteEmail'}>E-mail</FormLabel>
										<Input
											placeholder={'Enter e-mail address of a Gigover user'}
											name={'inviteEmail'}
											value={searchMail}
											onChange={(e) => setSearchMail(e.target.value)}
										/>
										{!inviteSuccess && (
											<>
												{searchMutation.isError && (
													<FormErrorMessage>
														The user with email {searchMail} could not
														be found. We will send him an invite to
														create an account on GigOver. Note that you
														still have to invite him after he has
														registered.
													</FormErrorMessage>
												)}
												{searchMutation.isError &&
													console.log('sending email!!')}
												)
												{inviteMutation.isError && (
													<FormErrorMessage>
														The invitation returned an error!
													</FormErrorMessage>
												)}
											</>
										)}
										{inviteSuccess && (
											<>
												<Text mt={4} color={Theme.colors.green}>
													User has been invited to the project
												</Text>
											</>
										)}
									</FormControl>
									{/* <FormControl id={'email'} isInvalid={!errors.email}>
										<FormLabel>Email address</FormLabel>
										<Input
											name="email"
											required={true}
											ref={register({
												required: 'Email is required'
											})}
											// {...register('email')} 🖕
											placeholder={'email@gigover.com'}
										/>

										<FormErrorMessage>{errors.email?.message}</FormErrorMessage>
									</FormControl> */}
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
								<Button
									loadingText={'Inviting'}
									isLoading={searchMutation.isLoading || inviteMutation.isLoading}
									disabled={searchMutation.isLoading || inviteMutation.isLoading}
									onClick={search}
								>
									Invite
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</form>
			</AlertDialog>
		</>
	);
};
