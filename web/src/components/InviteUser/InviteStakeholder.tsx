import React, { useCallback, useState } from 'react';
import { useAddStakeHolder } from '../../mutations/properties/useAddStakeHolder';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';
import { devError } from '../../utils/ConsoleUtils';
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Text,
	useToast
} from '@chakra-ui/react';
import { TrackerSelect } from '../TrackerSelect';
import { IPropertyUnit } from '../../models/Property';
import { FormActions } from '../FormActions';
// import emailjs from '@emailjs/browser';

interface InviteUserProps {
	units?: IPropertyUnit[];
	propertyId: number;
	propertyName?: string;
	onClose?: () => void;
}

export const InviteStakeholder = ({
	units,
	propertyId,
	propertyName,
	onClose
}: InviteUserProps): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const [inviteSuccess, setInviteSuccess] = useState(false);
	const [selectedUnit, setSelectedUnit] = useState<IPropertyUnit | undefined>();
	const [userId, setUserId] = useState<string | undefined>(); // So we have access to uId outside of the search function
	const [role, setRole] = useState<string>('');
	const addStakeholder = useAddStakeHolder();
	const searchMutation = useGetUserByEmail();
	const toast = useToast();
	console.log('name for email', propertyName);
	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				// devInfo('Found user with uId:', response.uId);
				console.log('Found user with uId:', response.uId);

				setInviteSuccess(true); // -> this might be enough to display the UI?
				setUserId(response.uId);
			}
			//! Add email info here
			toast({
				title: 'user not',
				description: 'The user was not found, make sure he has a gigover account',
				status: 'info',
				duration: 5000,
				isClosable: true
			});
			// sendEmailNoAccount();
		} catch (e) {
			devError(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);

	// For the email we send if the user does not have a gigOver account.
	// const emailServiceId = process.env.REACT_APP_EMAIL_SERVICE_ID;
	// const emailTemplateIdNoAccount = process.env.REACT_APP_EMAIL_STAKEHOLDER_TEMPLATE_ID;
	// const emailUserId = 'yz_BqW8_gSHEh6eAL'; // this is a public key, so no reason to have it in .env

	// We send an email to ask the user to create a gigOver account if he doesn't have one.
	// const sendEmailNoAccount = async () => {
	// 	const templateParams = {
	// 		propertyName,
	// 		to_email: searchMail
	// 	};
	// 	console.log('Sending email to: ', searchMail);
	// 	console.log('propertyName: ', templateParams.propertyName);
	// 	try {
	// 		await emailjs
	// 			.send(emailServiceId!, emailTemplateIdNoAccount!, templateParams!, emailUserId!)
	// 			.then(
	// 				function (response) {
	// 					console.log('SUCCESS!', response.status, response.text);
	// 				},
	// 				function (error) {
	// 					console.log('FAILED...', error);
	// 				}
	// 			);

	// 		// onClose();
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// };

	const addStakeholderToUnit = useCallback(async () => {
		try {
			if (selectedUnit) {
				console.log('values', propertyId, selectedUnit.unitId, userId, role);
				const response = await addStakeholder.mutateAsync({
					propertyId,
					unitId: selectedUnit.unitId,
					uId: userId!,
					role,
					name: '',
					email: '',
					phoneNumber: ''
				});

				if (response.id !== 0) {
					setSearchMail('');
					setInviteSuccess(true);
					toast({
						title: 'Stakeholder invited',
						description: 'The user has been added as a stakeholder to this unit.',
						status: 'success',
						duration: 3000,
						isClosable: true
					});
					onClose!();
				} else {
					throw new Error('Could not invite user.');
				}
			}
		} catch (e) {
			//
			devError(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [addStakeholder, propertyId, searchMail, selectedUnit]);

	const addStakeholderToProperty = useCallback(async () => {
		try {
			const response = await addStakeholder.mutateAsync({
				propertyId,
				uId: userId!,
				role,
				name: '',
				email: '',
				phoneNumber: ''
			});

			if (response.id !== 0) {
				setSearchMail('');
				setInviteSuccess(true);
				toast({
					title: 'Stakeholder invited',
					description: 'The user has been added as a stakeholder to this property.',
					status: 'success',
					duration: 3000,
					isClosable: true
				});
				onClose!();
			} else {
				throw new Error('Could not invite user.');
			}
		} catch (e) {
			//
			devError(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [addStakeholder, propertyId, searchMail, selectedUnit]);

	return (
		<>
			<FormControl
				isRequired={true}
				isInvalid={searchMutation.isError || addStakeholder.isError}
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
						{units && units.length === 0 ? (
							<>
								<FormLabel mt={4} htmlFor={'role'}>
									Role
								</FormLabel>
								<Input
									placeholder={'Role'}
									name={'role'}
									onChange={(e) => setRole(e.target.value)}
								/>
								<Button
									mt={4}
									onClick={addStakeholderToProperty}
									isLoading={addStakeholder.isLoading}
								>
									Add Stake holder to property
								</Button>
							</>
						) : (
							<>
								<Text mt={4} mb={4} color={'black'}>
									User was found. Please select a unit to add the user to.
								</Text>
								<TrackerSelect
									title={'Select a unit'}
									value={selectedUnit?.unitId}
									options={
										units
											? units.map((unit) => ({
													label: unit.name,
													value: unit.unitId
											  }))
											: []
									} // Handle undefined 'units' here
									isNumber={true}
									valueChanged={(newValue) => {
										if (!newValue) {
											setSelectedUnit(undefined);
										} else {
											const unitId = newValue as number;
											setSelectedUnit(
												units?.find((p) => p.unitId === unitId)
											);
										}
									}}
								/>
								<FormLabel mt={4} htmlFor={'role'}>
									Role
								</FormLabel>
								<Input
									placeholder={'Role'}
									name={'role'}
									onChange={(e) => setRole(e.target.value)}
								/>
								{selectedUnit && (
									<FormActions
										submitText={'Add Stake holder to unit'}
										onSubmit={addStakeholderToUnit}
										submitLoading={addStakeholder.isLoading}
									/>
								)}
							</>
						)}
					</>
				) : (
					(searchMutation.isError || addStakeholder.isError) && (
						<FormErrorMessage>
							The user with email {searchMail} could not be found or has already been
							invited.
						</FormErrorMessage>
					)
				)}
			</FormControl>
			{!inviteSuccess ? (
				<Button
					loadingText={'Inviting'}
					isLoading={searchMutation.isLoading || addStakeholder.isLoading}
					disabled={searchMutation.isLoading || addStakeholder.isLoading}
					onClick={search}
				>
					Invite
				</Button>
			) : null}
		</>
	);
};
