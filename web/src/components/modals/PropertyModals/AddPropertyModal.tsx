import { Box, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { IPropertyForm } from '../../../models/Property';
import { useAddProperty } from '../../../mutations/properties/useAddProperty';
import { FormActions } from '../../FormActions';
import { FormErrorBoundary, ModalErrorBoundary } from '../../ErrorBoundary';

interface PropertyModalProps {
	property?: IPropertyForm;
}

export const AddPropertyModal = ({ property }: PropertyModalProps): JSX.Element => {
	const closeModal = useCloseModal();

	return (
		<ModalErrorBoundary modalName="AddPropertyModal" onClose={closeModal}>
			<FormErrorBoundary formName="PropertyForm" preserveFormData={true}>
				<PropertyForm property={property} closeModal={closeModal} />
			</FormErrorBoundary>
		</ModalErrorBoundary>
	);
};

const PropertyForm = ({
	property,
	closeModal
}: PropertyModalProps & { closeModal: () => void }): JSX.Element => {
	const { mutate: addProperty, isError, error } = useAddProperty();

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IPropertyForm>({
		defaultValues: property,
		mode: 'onBlur'
	});

	// This ensures React Query errors are properly thrown and caught by error boundaries
	if (isError && error) {
		console.error('Error from mutation:', error);
		throw error;
	}

	const onSubmit = handleSubmit(async ({ name, address, zipCode, city, country, size, type }) => {
		addProperty(
			{
				name,
				address,
				zipCode,
				city,
				country,
				size,
				type
			},
			{
				onSuccess: () => {
					console.log('Property added');
					closeModal();
				},
				onError: (error) => {
					// Let the error boundary handle it by re-throwing
					throw error;
				}
			}
		);
	});

	return (
		<form onSubmit={onSubmit}>
			<VStack mb={-6} align={'stretch'}>
				<Text>
					Create a property here. You can add more info after you creat the property.
				</Text>
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
					submitText={'Create property'}
					onSubmit={onSubmit}
				/>
			</VStack>
		</form>
	);
};
