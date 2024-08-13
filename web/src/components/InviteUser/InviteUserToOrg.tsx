import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInviteUserToOrganization } from '../../mutations/organizations/useInviteUserToOrganization';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';
import { useGetUserInfo } from '../../queries/useGetUserInfo';
import { devInfo } from '../../utils/ConsoleUtils';
import { FormActions } from '../FormActions';
import { TrackerSelect } from '../TrackerSelect';

export const InviteUserToOrg = (): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const [privleges, setPrivleges] = useState<'A' | 'E' | 'V'>('V');
	const [selectedPrivleges, setSelectedPrivleges] = useState<'A' | 'E' | 'V' | undefined>();
	const [inviteSuccess, setInviteSuccess] = useState(false);
	const { data: userInfo } = useGetUserInfo();
	const inviteMutation = useInviteUserToOrganization();
	const searchMutation = useGetUserByEmail();
	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				devInfo('Found user with uId:', response.uId);
				setInviteSuccess(true);

				// 	inviteMutation.mutateAsync({ email, priv }).then((res) => {
				// 		if (res.errorCode === 'OK') {
				// 			setSearchMail('');
				// 			setInviteSuccess(true);
				// 		} else {
				// 			throw new Error('Could not invite user.');
				// 		}
				// 	});
			}
		} catch (e) {
			console.error(e);
			throw new Error('Could not invite user.');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);

	const addMemberToOrganization = useCallback(async () => {
		try {
			const response = await inviteMutation.mutateAsync({
				email: searchMail,
				priv: privleges
			});

			if (response.errorCode === 'OK') {
				setSearchMail('');
				setInviteSuccess(true);
			} else {
				throw new Error('Could not invite user.');
			}
		} catch (e) {
			console.error(e);
			throw new Error('Could not invite user.');
		}
	}, [inviteMutation, searchMail, privleges]);

	console.log({ userInfo });

	const { register, handleSubmit } = useForm<{ email: string; priv: string }>({
		defaultValues: {
			email: '',
			priv: 'W'
		}
	});

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
					type="email"
					value={searchMail}
					onChange={(e) => setSearchMail(e.target.value)}
				/>

				{inviteSuccess ? (
					<>
						<FormLabel htmlFor={'priv'}>Privleges</FormLabel>
						<TrackerSelect
							title={'Select privleges'}
							options={[
								{ value: 'A', label: 'Admin' },
								{ value: 'V', label: 'Viewer' },
								{ value: 'E', label: 'Editor' }
							]}
							valueChanged={(newValue) => {
								if (!newValue) {
									setSelectedPrivleges(undefined);
								} else {
									setSelectedPrivleges(
										newValue.valueOf as unknown as 'A' | 'E' | 'V'
									);
								}
							}}
						/>
						{/* <Select
							placeholder="Select privleges"
							onChange={(e) => setPrivleges(e.target.value as 'A' | 'E' | 'V')}
						>
							<option value="A">Admin</option>
							<option value="V">Viewer</option>
							<option value="E">Editor</option>
						</Select> */}
					</>
				) : null}

				{selectedPrivleges && (
					<FormActions
						submitText={'Add member to organization'}
						onSubmit={addMemberToOrganization}
						submitLoading={inviteMutation.isLoading}
					/>
				)}
			</FormControl>
			<Flex justifyContent={'flex-end'}>
				{!inviteSuccess ? (
					<Button
						loadingText={'Inviting'}
						isLoading={searchMutation.isLoading || inviteMutation.isLoading}
						disabled={searchMutation.isLoading || inviteMutation.isLoading}
						onClick={search}
					>
						Invite
					</Button>
				) : null}
			</Flex>
		</>
	);
};
