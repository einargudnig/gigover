import React, { useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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

export const InviteButton = (tenderDesc): JSX.Element => {
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
			await emailjs.send(emailServiceId!, emailTemplateId!, templateParams!, emailUserId!);
			console.log('Email sent!');

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
										Send invite with email to let people add offers to the
										Procurement
									</Text>
									<FormControl id={'email'} isInvalid={!errors.email}>
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
								<Button type="submit">Send email</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</form>
			</AlertDialog>
		</>
	);
};
