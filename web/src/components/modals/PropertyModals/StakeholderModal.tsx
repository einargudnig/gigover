import React from 'react';
import { IStakeholder } from '../../../models/Property';
import { Text, Box, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { FormActions } from '../../FormActions';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { useForm } from 'react-hook-form';

interface StakeholderModalProps {
	stakeholder?: IStakeholder;
}

export const StakeholderModal = ({ stakeholder }: StakeholderModalProps): JSX.Element => {
	console.log(stakeholder);
	const closeModal = useCloseModal();

	const { register, control, handleSubmit } = useForm<IStakeholder>({
		defaultValues: stakeholder,
		mode: 'onBlur'
	});
	return (
		<form>
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
					submitText={'Create property'}
					// onSubmit={onSubmit}
				/>
			</VStack>
		</form>
	);
};
