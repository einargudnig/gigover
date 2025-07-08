import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	Spacer,
	Text,
	Tooltip,
	useToast
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { Theme } from '../../../../Theme';
import { useInviteBidder } from '../../../../mutations/procurement/useInviteBidder';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { useGetUserByEmail } from '../../../../queries/useGetUserByEmail';
import { devError, devInfo } from '../../../../utils/ConsoleUtils';
import { TenderInfo } from './TenderInfo';
import emailjs from '@emailjs/browser';

export interface InviteBidderProps {
	tenderId: number;
	onBidderAdded: () => void;
}

export const AddBidder = ({ tenderId, onBidderAdded }: InviteBidderProps): JSX.Element => {
	const { data } = useGetTenderById(tenderId);
	const tender = data?.tender;
	const tenderStatus = tender?.status;
	const tenderBidders = tender?.bidders;
	const hasBidders = tenderBidders && tenderBidders.length > 0;

	const toast = useToast();

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
						// TODO: Add a toast notification here
						toast({
							title: 'User invited to the project',
							status: 'success',
							duration: 3000,
							isClosable: true
						});
						sendEmailAccount();
					} else {
						throw new Error('Could not invite user.');
					}
				});
			} else {
				toast({
					title: 'User not found',
					description:
						'The user you tried to invite does not have an GigOver account. We will send an email asking him to create one. Note that you still have to invite him after he has created the account.',
					status: 'info',
					duration: 3000,
					isClosable: true
				});
				sendEmailNoAccount();
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
	const emailServiceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
	const emailTemplateIdNoAccount = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
	const emailTemplateIdAccount = import.meta.env.VITE_EMAIL_TEMPLATE_ID_ACCOUNT;
	const emailUserId = 'yz_BqW8_gSHEh6eAL'; // this is a public key, so no reason to have it in .env

	// We send an email to ask the user to create a gigOver account if he doesn't have one.
	const sendEmailNoAccount = async () => {
		const templateParams = {
			tenderDesc: tender?.description,
			to_email: searchMail
		};
		console.log('Sending email to: ', searchMail);
		console.log('tenderDesc: ', templateParams.tenderDesc);
		try {
			await emailjs
				.send(emailServiceId!, emailTemplateIdNoAccount!, templateParams!, emailUserId!)
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

	// We also want to send an email even though the user has an account.
	const sendEmailAccount = async () => {
		const templateParams = {
			tenderDesc: tender?.description,
			to_email: searchMail
		};
		console.log('Sending email to: ', searchMail);
		console.log('tenderDesc: ', templateParams.tenderDesc);
		try {
			await emailjs
				.send(emailServiceId!, emailTemplateIdAccount!, templateParams!, emailUserId!)
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

	return (
		<Box backgroundColor={'white'} py={6} rounded={'md'}>
			<Flex justifyContent={'center'}>
				<Heading size={'md'}>Add Bidders</Heading>
			</Flex>

			<Box>
				<Accordion allowToggle>
					<AccordionItem>
						<h2>
							<AccordionButton>
								<Box as="span">Tender Info</Box>
								<AccordionIcon />
							</AccordionButton>
						</h2>
						<AccordionPanel pb={4}>
							<TenderInfo tender={tender} />
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</Box>

			<Box px={10} py={4} border={'1px'} borderColor={'gray.500'} rounded={'md'}>
				<Flex justifyContent={'space-between'} gap={6}>
					<Box w="50%">
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
							{inviteSuccess ? (
								<>
									<Text mt={4} color={Theme.colors.green}>
										User has been invited to the project
									</Text>
								</>
							) : (
								(searchMutation.isError || inviteMutation.isError) && (
									<FormErrorMessage>
										The user with email {searchMail} could not be found or has
										already been invited.
									</FormErrorMessage>
								)
							)}
						</FormControl>
						<Flex justifyContent={'flex-end'}>
							{tenderStatus === 1 ? (
								<Button
									variant={'outline'}
									colorScheme={'black'}
									loadingText={'Inviting'}
									isLoading={searchMutation.isPending || inviteMutation.isPending}
									disabled={searchMutation.isPending || inviteMutation.isPending}
									onClick={search}
								>
									Invite
								</Button>
							) : (
								<Text>You have to publish the tender first!</Text>
							)}
						</Flex>
					</Box>
					<Spacer />
					<Box w="50%">
						<Heading size={'sm'}>Invited bidders:</Heading>
						{tenderBidders &&
							tenderBidders.map((bidder) => (
								<Text key={bidder.bidderId}>• {bidder.email}</Text>
							))}
					</Box>
				</Flex>
			</Box>
			<Flex mt={3} justifyContent={'end'}>
				{tenderStatus === 1 && (
					<>
						{hasBidders ? (
							<Tooltip label="Finish invite bidders and go back to Tender list">
								<Button
									variant={'outline'}
									colorScheme={'black'}
									onClick={() => {
										onBidderAdded();
									}}
								>
									Finish
								</Button>
							</Tooltip>
						) : (
							<Text>Invite at least one bidder to finish</Text>
						)}
					</>
				)}
			</Flex>
		</Box>
	);
};
