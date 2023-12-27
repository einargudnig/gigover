import React from 'react';
import { IPropertyForm } from '../../../models/Property';
import { FormActions } from '../../FormActions';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { useForm } from 'react-hook-form';
import { Box, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { useAddProperty } from '../../../mutations/properties/useAddProperty';

interface PropertyModalProps {
	property?: IPropertyForm;
}

export const AddPropertyModal = ({ property }: PropertyModalProps): JSX.Element => {
	console.log(property);
	const closeModal = useCloseModal();

	const { mutate: addProperty } = useAddProperty();

	const { register, handleSubmit } = useForm<IPropertyForm>({
		defaultValues: property,
		mode: 'onBlur'
	});

	const onSubmit = handleSubmit(async ({ name, address, zipCode, city, country, size, type }) => {
		try {
			addProperty({
				name,
				address,
				zipCode,
				city,
				country,
				size,
				type
			});
			console.log('Property added');

			closeModal();
		} catch (error) {
			console.log(error);
		}
	});

	return (
		<form onSubmit={onSubmit}>
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
				<FormControl id={'zipCode'}>
					<FormLabel>Zip code</FormLabel>
					<Input
						required={true}
						{...register('zipCode', {
							required: 'Zip code is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'city'}>
					<FormLabel>City</FormLabel>
					<Input
						required={true}
						{...register('city', {
							required: 'City is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'country'}>
					<FormLabel>Country</FormLabel>
					<Input
						required={true}
						{...register('country', {
							required: 'Country is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'size'}>
					<FormLabel>Property size</FormLabel>
					<Input
						required={true}
						{...register('size', {
							required: 'Size is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'type'}>
					<FormLabel>Property type</FormLabel>
					<Input
						required={true}
						{...register('type', {
							required: 'Type code is required'
						})}
					/>
				</FormControl>
				<FormActions
					cancelText={'Cancel'}
					onCancel={closeModal}
					submitText={'Create property'}
					onSubmit={onSubmit}
				/>
			</VStack>
		</form>
	);
};
