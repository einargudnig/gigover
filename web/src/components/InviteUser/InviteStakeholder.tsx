import React, { useCallback, useState } from 'react';
import { useAddStakeHolder } from '../../mutations/properties/useAddStakeHolder';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';
import { devError } from '../../utils/ConsoleUtils';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react';
import { TrackerSelect } from '../TrackerSelect';
import { IPropertyUnit } from '../../models/Property';

interface InviteUserProps {
	units?: IPropertyUnit[];
	propertyId: number;
}

export const InviteStakeholder = ({ units, propertyId }: InviteUserProps): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const [inviteSuccess, setInviteSuccess] = useState(false);
	const [selectedUnit, setSelectedUnit] = useState<IPropertyUnit | undefined>();
	const [userId, setUserId] = useState<string | undefined>(); // So we have access to uId outside of the search function
	const addStakeholder = useAddStakeHolder();
	const searchMutation = useGetUserByEmail();
	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			//return the response to show the UI?
			if (response.uId) {
				// devInfo('Found user with uId:', response.uId);
				console.log('Found user with uId:', response.uId);

				setInviteSuccess(true); // -> this might be enough to display the UI?
				setUserId(response.uId);
			}
		} catch (e) {
			//
			devError(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);

	const addStakeholderToUnit = useCallback(async () => {
		try {
			if (selectedUnit) {
				const response = await addStakeholder.mutateAsync({
					propertyId,
					unitId: selectedUnit.unitId,
					uId: userId!,
					role: 'Stakeholder',
					name: '',
					email: '',
					phoneNumber: ''
				});

				if (response.id !== 0) {
					setSearchMail('');
					setInviteSuccess(true);
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
			if (selectedUnit) {
				const response = await addStakeholder.mutateAsync({
					propertyId,
					uId: userId!,
					role: 'Stakeholder',
					name: '',
					email: '',
					phoneNumber: ''
				});

				if (response.id !== 0) {
					setSearchMail('');
					setInviteSuccess(true);
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
									onChange={(e) => setSearchMail(e.target.value)}
								/>
								<Button mt={4}>Add Stake holder to property</Button>
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
									onChange={(e) => setSearchMail(e.target.value)}
								/>
								{selectedUnit && <Button mt={4}>Add Stake holder to unit</Button>}
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
