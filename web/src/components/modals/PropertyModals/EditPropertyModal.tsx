import React from 'react';
import { IPropertyForm } from '../../../models/Property';
import { FormActions } from '../../FormActions';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { useForm } from 'react-hook-form';
import { Box, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { useEditProperty } from '../../../mutations/properties/useEditProperty';

interface PropertyModalProps {
	property?: IPropertyForm;
}

export const EditPropertyModal = ({ property }: PropertyModalProps): JSX.Element => {
	const closeModal = useCloseModal();

	const { mutate: editProperty } = useEditProperty();

	const { register, handleSubmit } = useForm<IPropertyForm>({
		defaultValues: property,
		mode: 'onBlur'
	});

	const onSubmit = handleSubmit(
		async ({ propertyId, name, address, zipCode, city, country, size, type }) => {
			try {
				editProperty({
					propertyId,
					name,
					address,
					zipCode,
					city,
					country,
					size,
					type
				});
				console.log('Property edited!');

				closeModal();
			} catch (error) {
				console.log(error);
			}
		}
	);

	return (
		<form onSubmit={onSubmit}>
			<VStack mb={-6} align={'stretch'}>
				<Text>Edit the property here, update name, sixe and more</Text>
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
							required: 'Zip code is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'country'}>
					<FormLabel>Country</FormLabel>
					<Input
						required={true}
						{...register('country', {
							required: 'Zip code is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'size'}>
					<FormLabel>Property size</FormLabel>
					<Input
						required={true}
						{...register('size', {
							required: 'Zip code is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl id={'type'}>
					<FormLabel>Property type</FormLabel>
					<Input
						required={true}
						{...register('type', {
							required: 'Zip code is required'
						})}
					/>
				</FormControl>
				<FormActions
					cancelText={'Cancel'}
					onCancel={closeModal}
					submitText={'Edit property'}
					onSubmit={onSubmit}
				/>
			</VStack>
		</form>
	);
};
