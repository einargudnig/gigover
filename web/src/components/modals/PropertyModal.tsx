import React from 'react';
import { IProperty } from '../../models/Property';
import { FormActions } from '../FormActions';
import { useCloseModal } from '../../hooks/useCloseModal';
import { Controller, useForm } from 'react-hook-form';
import { Box, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';

interface PropertyModalProps {
	property?: IProperty;
}

export const PropertyModal = ({ property }: PropertyModalProps): JSX.Element => {
	console.log(property);
	const closeModal = useCloseModal();

	const { register, control, handleSubmit } = useForm<IProperty>({
		defaultValues: property,
		mode: 'onBlur'
	});

	return (
		<form>
			<VStack mb={-6} align={'stretch'}>
				<Text>
					Create a property here. You can add more info after you creat the property.
				</Text>
				<FormControl id={'name'}>
					<FormLabel>Property name</FormLabel>
					<Input
						required={true}
						{...register('name', {
							required: 'Property name is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'address'}>
					<FormLabel>Address/Location</FormLabel>
					<Input
						required={true}
						{...register('address', {
							required: 'Address is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'zip'}>
					<FormLabel>Zip code</FormLabel>
					<Input
						required={true}
						{...register('zip', {
							required: 'Zip code is required'
						})}
					/>
				</FormControl>
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
