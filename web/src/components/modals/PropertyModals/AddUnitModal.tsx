import { Box, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { IPropertyUnit } from '../../../models/Property';
import { useAddUnit } from '../../../mutations/properties/useAddUnit';
import { FormActions } from '../../FormActions';

interface UnitModalProps {
	unit?: IPropertyUnit;
	propertyId: number;
}

export const AddUnitModal = ({ unit, propertyId }: UnitModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const { mutate: addUnit } = useAddUnit();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IPropertyUnit>({
		defaultValues: unit,
		mode: 'onBlur'
	});

	const onSubmit = handleSubmit(async ({ name, size, type }) => {
		try {
			addUnit({
				name,
				size,
				type,
				propertyId
			});
			console.log('Unit added to propertyId:', propertyId);

			closeModal();
		} catch (error) {
			console.log(error);
		}
	});

	return (
		<form onSubmit={onSubmit}>
			<VStack mb={-6} align={'stretch'}>
				<Text>Add a unit to the property.</Text>
				<FormControl id={'name'} isInvalid={!!errors.name}>
					<FormLabel>Unit name</FormLabel>
					<Input
						required={true}
						{...register('name', {
							required: 'Property name is required'
						})}
					/>
					{errors.name && <Text color="red.500">{errors.name.message}</Text>}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'size'} isInvalid={!!errors.size}>
					<FormLabel>Unit size</FormLabel>
					<Input
						required={true}
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
					<FormLabel>Unit type</FormLabel>
					<Input
						required={true}
						{...register('type', {
							required: 'Unit type is required'
						})}
					/>
					{errors.type && <Text color="red.500">{errors.type.message}</Text>}
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
