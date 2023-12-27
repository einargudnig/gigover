import React from 'react';
import { IPropertyUnit } from '../../../models/Property';
import { Box, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { FormActions } from '../../FormActions';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { useForm } from 'react-hook-form';

interface UnitModalProps {
	unit?: IPropertyUnit;
}

export const AddUnitModal = ({ unit }: UnitModalProps): JSX.Element => {
	console.log(unit);
	const closeModal = useCloseModal();

	const { register } = useForm<IPropertyUnit>({
		defaultValues: unit,
		mode: 'onBlur'
	});
	return (
		<form>
			<VStack mb={-6} align={'stretch'}>
				<Text>Add a unit to the property.</Text>
				<FormControl id={'name'}>
					<FormLabel>Unit name</FormLabel>
					<Input
						required={true}
						{...register('name', {
							required: 'Property name is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'size'}>
					<FormLabel>Unit size</FormLabel>
					<Input
						required={true}
						{...register('size', {
							required: 'Address is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'type'}>
					<FormLabel>Unit type</FormLabel>
					<Input
						required={true}
						{...register('type', {
							required: 'Zip code is required'
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
