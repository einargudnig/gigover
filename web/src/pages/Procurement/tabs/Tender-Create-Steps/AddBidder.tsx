import { useCallback, useEffect, useState } from 'react';
import { useInviteBidder } from '../../../../mutations/procurement/useInviteBidder';
import { useGetUserByEmail } from '../../../../queries/useGetUserByEmail';
import { devError, devInfo } from '../../../../utils/ConsoleUtils';
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Text
} from '@chakra-ui/react';
import { Theme } from '../../../../Theme';

export interface InviteUserProps {
	tenderId: number;
}

export const AddBidder = ({ tenderId }: InviteUserProps): JSX.Element => {
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

	return (
		<>
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
							The user with email {searchMail} could not be found or has already been
							invited.
						</FormErrorMessage>
					)
				)}
			</FormControl>
			<Flex justifyContent={'flex-end'}>
				<Button
					variant={'outline'}
					colorScheme={'gray'}
					loadingText={'Inviting'}
					isLoading={searchMutation.isLoading || inviteMutation.isLoading}
					disabled={searchMutation.isLoading || inviteMutation.isLoading}
					onClick={search}
				>
					Invite
				</Button>
			</Flex>
		</>
	);
};
