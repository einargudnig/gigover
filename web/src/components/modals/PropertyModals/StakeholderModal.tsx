import React from 'react';
import { IStakeholder } from '../../../models/Property';
import { Text, Box, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { FormActions } from '../../FormActions';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { useForm } from 'react-hook-form';
import { useAddStakeHolder } from '../../../mutations/properties/useAddStakeHolder';

interface StakeholderModalProps {
	stakeholder?: IStakeholder;
	propertyId: number;
}

export const StakeholderModal = ({
	stakeholder,
	propertyId
}: StakeholderModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const { mutate: addStakeholder } = useAddStakeHolder();

	const { register, handleSubmit } = useForm<IStakeholder>({
		defaultValues: stakeholder,
		mode: 'onBlur'
	});

	const onSubmit = handleSubmit(async ({ name, phoneNumber, email, role }) => {
		try {
			addStakeholder({
				name,
				phoneNumber,
				email,
				role,
				unitId: 5, //! This need to be fixed!
				propertyId
			});
			console.log('Stakeholder added');

			closeModal();
		} catch (error) {
			console.log(error);
		}
	});

	return (
		<form onSubmit={onSubmit}>
			<VStack mb={-6} align={'stretch'}>
				<Text>Add stakeholders</Text>
				<FormControl id={'name'}>
					<FormLabel>Stakeholder name</FormLabel>
					<Input
						required={true}
						{...register('name', {
							required: 'Stakeholder name is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'phoneNumber'}>
					<FormLabel>Phone number</FormLabel>
					<Input
						required={true}
						{...register('phoneNumber', {
							required: 'Phone number is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'email'}>
					<FormLabel>Email</FormLabel>
					<Input
						required={true}
						{...register('email', {
							required: 'Email is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'role'}>
					<FormLabel>Role</FormLabel>
					<Input
						required={true}
						{...register('role', {
							required: 'Role is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormActions
					cancelText={'Cancel'}
					onCancel={closeModal}
					submitText={'Add Stakeholder'}
					onSubmit={onSubmit}
				/>
			</VStack>
		</form>
	);
};
