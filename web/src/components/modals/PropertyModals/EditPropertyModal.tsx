import { Box, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { IPropertyForm } from '../../../models/Property';
import { useEditProperty } from '../../../mutations/properties/useEditProperty';
import { FormActions } from '../../FormActions';

interface PropertyModalProps {
	property?: IPropertyForm;
}

export const EditPropertyModal = ({ property }: PropertyModalProps): JSX.Element => {
	const closeModal = useCloseModal();

	const { mutate: editProperty } = useEditProperty();

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IPropertyForm>({
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
				<Text>Edit a property.</Text>
				<FormControl id={'name'} isInvalid={!!errors.name}>
					<FormLabel>Property name</FormLabel>
					<Input
						{...register('name', {
							required: 'Property name is required'
						})}
					/>
					{errors.name && <Text color="red.500">{errors.name.message}</Text>}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'address'} isInvalid={!!errors.address}>
					<FormLabel>Address/Location</FormLabel>
					<Input
						{...register('address', {
							required: 'Address is required'
						})}
					/>
					{errors.address && <Text color="red.500">{errors.address.message}</Text>}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'zipCode'} isInvalid={!!errors.zipCode}>
					<FormLabel>Zip code</FormLabel>
					<Input
						{...register('zipCode', {
							required: 'Zip code is required'
						})}
					/>
					{errors.zipCode && <Text color="red.500">{errors.zipCode.message}</Text>}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'city'} isInvalid={!!errors.city}>
					<FormLabel>City</FormLabel>
					<Input
						{...register('city', {
							required: 'City is required'
						})}
					/>
					{errors.city && <Text color="red.500">{errors.city.message}</Text>}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'country'} isInvalid={!!errors.country}>
					<FormLabel>Country</FormLabel>
					<Input
						{...register('country', {
							required: 'Country is required'
						})}
					/>
					{errors.country && <Text color="red.500">{errors.country.message}</Text>}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'size'} isInvalid={!!errors.size}>
					<FormLabel>Property size</FormLabel>
					<Input
						{...register('size', {
							required: 'Size is required',
							valueAsNumber: true,
							validate: (value) => !isNaN(value) || 'Size must be a number'
						})}
					/>
					{errors.size && <Text color="red.500">{errors.size.message}</Text>}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'type'} isInvalid={!!errors.type}>
					<FormLabel>Property type</FormLabel>
					<Input
						{...register('type', {
							required: 'Type code is required'
						})}
					/>
					{errors.type && <Text color="red.500">{errors.type.message}</Text>}
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
