import React from 'react';
import { IPropertyUnit } from '../../../models/Property';
import { useParams } from 'react-router-dom';
import { Box, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { FormActions } from '../../FormActions';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { useForm } from 'react-hook-form';
import { useAddUnit } from '../../../mutations/properties/useAddUnit';

interface UnitModalProps {
	unit?: IPropertyUnit;
}

export const AddUnitModal = ({ unit }: UnitModalProps): JSX.Element => {
	const params = useParams();
	console.log('IN MODAL', params);
	const closeModal = useCloseModal();
	const { mutate: addUnit } = useAddUnit();
	const { register, handleSubmit } = useForm<IPropertyUnit>({
		defaultValues: unit,
		mode: 'onBlur'
	});

	const onSubmit = handleSubmit(async ({ name, size, type }) => {
		try {
			addUnit({
				name,
				size,
				type,
				propertyId: 2 //! This need to be fixed!
			});
			console.log('Unit added');

			closeModal();
		} catch (error) {
			console.log(error);
		}
	});

	return (
		<form onSubmit={onSubmit}>
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
					submitText={'Create unit'}
					onSubmit={onSubmit}
				/>
			</VStack>
		</form>
	);
};
