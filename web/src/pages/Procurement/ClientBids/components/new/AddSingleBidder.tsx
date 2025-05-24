import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react';
import emailjs from '@emailjs/browser';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bid } from '../../../../../models/Tender';

import { useGetUserByEmail } from '../../../../../queries/useGetUserByEmail';
import { devError } from '../../../../../utils/ConsoleUtils';

interface AddSingleBidderProps {
	onClientInvite: (clientUId: string) => void;
}

export function AddSingleBidder({ onClientInvite }: AddSingleBidderProps) {
	const [searchMail, setSearchMail] = useState('');
	const [showMessage, setShowMessage] = useState(false);
	const searchMutation = useGetUserByEmail();

	const { register } = useForm<Bid>({
		defaultValues: {
			clientUId: ''
		},
		mode: 'onBlur'
	});

	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				console.log('Found user with uId:', response.uId);
				onClientInvite(response.uId);
			} else {
				setShowMessage(true);
				sendEmailNoAccount(searchMail);
			}
		} catch (e) {
			devError(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);

	return (
		<Box>
			<Heading size={'md'}>Create and send a bid to your client.</Heading>
			<Text mt={3}>
				Your client must have a Gigover account. Enter their Gigover account email.
			</Text>

			<Box mt={5}>
				<form>
					<FormControl>
						<FormLabel>Client email</FormLabel>
						<Input
							type="email"
							required={true}
							{...register('clientUId')}
							value={searchMail}
							onChange={(e) => setSearchMail(e.target.value)}
							placeholder="Enter client email"
							borderColor={'gray.300'}
							borderRadius={'md'}
						/>
						<Flex justify={'end'} mt={4}>
							<Button
								variant={'outline'}
								colorScheme={'black'}
								onClick={search}
								isLoading={searchMutation.isPending}
								isDisabled={searchMutation.isPending || searchMutation.isError}
							>
								Invite
							</Button>
						</Flex>
					</FormControl>
				</form>
			</Box>
			{showMessage && (
				<Flex justifyContent={'center'}>
					<Text mt={3} color={'red.500'}>
						User not found, he will be sent an email to invite him to create a Gigover
						account
					</Text>
				</Flex>
			)}
		</Box>
	);
}

// We send an email to ask the user to create a gigOver account if he doesn't have one.
const sendEmailNoAccount = async (searchMail: string) => {
	// For the email we send if the user does not have a gigOver account.
	const emailServiceId = process.env.REACT_APP_EMAIL_SERVICE_ID;
	const emailTemplateId = process.env.REACT_APP_EMAIL_CLIENT_BID_TEMPLATE_ID;
	const emailUserId = 'yz_BqW8_gSHEh6eAL'; // this is a public key, so no reason to have it in .env

	const templateParams = {
		bidDesc: 'Bid description',
		to_email: searchMail
	};
	console.log('Sending email to: ', searchMail);
	console.log('propertyName: ', templateParams.bidDesc);
	try {
		await emailjs.send(emailServiceId!, emailTemplateId!, templateParams!, emailUserId!).then(
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
