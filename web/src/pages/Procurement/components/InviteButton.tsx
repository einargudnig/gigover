import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
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
	Spacer
} from '@chakra-ui/react';

type FormData = {
	email: string;
};

export const InviteButton = (): JSX.Element => {
	//! EMAIL STUFF
	const YOUR_SERVICE_ID = 'service_ja5bcmu';
	const YOUR_TEMPLATE_ID = 'template_2j30xxt';
	const YOUR_USER_ID = 'yz_BqW8_gSHEh6eAL';

	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		const templateParams = {
			to_email: data.email
		};

		try {
			await emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams, YOUR_USER_ID);
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
			<Button onClick={handleOpenDialog}>Invite User</Button>

			<AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<AlertDialogOverlay>
						<AlertDialogContent>
							<AlertDialogHeader>Invite user with email</AlertDialogHeader>

							<AlertDialogBody>
								<VStack spacing={4}>
									<FormControl isInvalid={!!errors.email}>
										<FormLabel>Email address</FormLabel>
										<Input
											type="email"
											{...register('email', { required: true })}
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
