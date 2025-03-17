import { Box, Button, Flex, FormControl, FormLabel, Input, Text, useToast } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetUserByEmail } from '../../../../../queries/useGetUserByEmail';
import { devError } from '../../../../../utils/ConsoleUtils';

export function AddSingleBidder() {
	const [searchMail, setSearchMail] = useState('');
	const [uId, setUId] = useState('');
	const [inviteSuccess, setInviteSuccess] = useState(false); // use this to update the ui
	const searchMutation = useGetUserByEmail();

	const { register, control, handleSubmit } = useForm<Bid>({
		defaultValues: {
			clientUId: ''
		},
		mode: 'onBlur'
	});

	const toast = useToast();

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
				// sendEmailNoAccount();
			}
			// setInviteSuccess(false);
		} catch (e) {
			devError(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);

	return (
		<Box>
			<Text>First step is to add a client.</Text>
			<Text>
				If the client does not have a Gigover account, you can send him an email to create
				one.
			</Text>

			<Box>
				<form>
					<FormControl>
						<FormLabel>Client email</FormLabel>
						<Input
							type="email"
							required={true}
							{...register('clientUId')}
							value={searchMail}
							onChange={(e) => setSearchMail(e.target.value)}
						/>
						<Flex justify={'end'} mt={4}>
							<Button
								variant={'outline'}
								colorScheme={'black'}
								onClick={search}
								isLoading={searchMutation.isLoading}
								isDisabled={searchMutation.isLoading || searchMutation.isError}
							>
								Invite
							</Button>
						</Flex>
						{inviteSuccess && (
							<Box>
								<Text>User found - You can create bid!</Text>
							</Box>
						)}
					</FormControl>
				</form>
			</Box>
		</Box>
	);
}
