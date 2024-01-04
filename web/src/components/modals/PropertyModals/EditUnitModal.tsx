import React from 'react';
import { IPropertyUnit } from '../../../models/Property';
import { Box, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { FormActions } from '../../FormActions';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { useForm } from 'react-hook-form';
import { useEditUnit } from '../../../mutations/properties/useEditUnit';

interface UnitModalProps {
	unit?: IPropertyUnit;
	propertyId: number;
}

export const EditUnitModal = ({ unit, propertyId }: UnitModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const { mutate: editUnit } = useEditUnit();

	const { register, handleSubmit } = useForm<IPropertyUnit>({
		defaultValues: unit,
		mode: 'onBlur'
	});

	const onSubmit = handleSubmit(async ({ unitId, name, size, type }) => {
		try {
			editUnit({
				unitId,
				name,
				size,
				type,
				propertyId
			});
			console.log('Unit edited for propertyId:', propertyId);

			closeModal();
		} catch (error) {
			console.log(error);
		}
	});
	return (
		<form onSubmit={onSubmit}>
			<VStack mb={-6} align={'stretch'}>
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
					<Input required={true} {...register('size')} />
				</FormControl>
				<Box mb={6} />
				<FormControl id={'type'}>
					<FormLabel>Unit type</FormLabel>
					<Input
						required={true}
						{...register('type', {
							required: 'Type is required'
						})}
					/>
				</FormControl>
				<Box mb={6} />
				<FormActions
					cancelText={'Cancel'}
					onCancel={closeModal}
					submitText={'Edit unit'}
					onSubmit={onSubmit}
				/>
			</VStack>
		</form>
	);
};
