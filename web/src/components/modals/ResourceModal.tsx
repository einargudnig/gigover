import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useCloseModal } from '../../hooks/useCloseModal';
import { FormActions } from '../FormActions';
import {
	Box,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Input
} from '@chakra-ui/react';
import { ModalContext } from '../../context/ModalContext';
import { useModifyResource } from '../../mutations/useModifyResource';
import { devError } from '../../utils/ConsoleUtils';
import { Resource } from '../../models/Resource';
import { Modal } from '../Modal';
import { Tabs } from '../tabs/Tabs';

export const ResourceModal = (): JSX.Element => {
	const closeModal = useCloseModal();
	const [{ resources }] = useContext(ModalContext);
	const { mutateAsync, isLoading, isError, error } = useModifyResource();
	const { register, handleSubmit, errors, control } = useForm<Resource>({
		defaultValues: resources?.resource,
		mode: 'onBlur'
	});

	const onSubmit = handleSubmit(async (values) => {
		try {
			await mutateAsync({
				...values
			});
			closeModal();
		} catch (e) {
			devError('Error', e);
		}
	});

	return (
		<Modal
			open={true}
			title={resources?.resource ? 'View resource' : 'Create resource'}
			flexContainer={true}
		>
			<div style={{ height: '100%', flex: 1 }}>
				{isError && (
					<>
						{/* Server errors */}
						<p>{error?.errorText}</p>
						<small>{error?.errorCode}</small>
					</>
				)}
				<form onSubmit={onSubmit} style={{ height: '100%' }}>
					<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
						<div style={{ flex: 1 }}>
							<div style={{ display: 'flex', gap: 16 }}>
								<FormControl
									id={'name'}
									isRequired
									isInvalid={Boolean(errors.name)}
								>
									<FormLabel>Resource name</FormLabel>
									<Input
										name="name"
										required={true}
										ref={register({ required: 'The resource name is missing' })}
									/>
									{errors.name ? (
										<FormErrorMessage>{errors.name.message}</FormErrorMessage>
									) : (
										<FormHelperText>Give your resource a name</FormHelperText>
									)}
								</FormControl>
								<FormControl
									id={'serialNr'}
									isRequired
									isInvalid={Boolean(errors.serialNr)}
								>
									<FormLabel>
										Resource ID -{' '}
										<span style={{ color: '#F9AE78' }}>must be unique</span>
									</FormLabel>
									<Input
										name="serialNr"
										required={true}
										ref={register({ required: 'The resource ID is missing' })}
									/>
									{errors.serialNr ? (
										<FormErrorMessage>
											{errors.serialNr.message}
										</FormErrorMessage>
									) : (
										<FormHelperText>
											What is the resource ID? Ex. DXA-59
										</FormHelperText>
									)}
								</FormControl>
							</div>
							<Box mb={6} />
							<FormControl
								id={'description'}
								isRequired
								isInvalid={Boolean(errors.description)}
							>
								<FormLabel>Resource description</FormLabel>
								<Input name="description" required={true} ref={register} />
								{errors.description ? (
									<FormErrorMessage>
										{errors.description.message}
									</FormErrorMessage>
								) : (
									<FormHelperText>Describe your resource</FormHelperText>
								)}
							</FormControl>
							<Tabs
								labelKey={'name'}
								tabs={[
									{ name: 'Resource details', value: 1 },
									{ name: 'Resource cost', value: 2 },
									{ name: 'Description', value: 3 }
								]}
							>
								{({ tab }) => {
									switch (tab.value) {
										case 1:
											return <p>Resource details</p>;
										case 2:
											return <p>Resource cost</p>;
										case 3:
											return <p>Description</p>;
										default:
											return <p>...</p>;
									}
								}}
							</Tabs>
						</div>
						<FormActions
							submitText={
								resources?.resource ? 'Update resource' : 'Create a resource'
							}
							submitLoading={isLoading}
							submitDisabled={isLoading}
							cancelText={'Discard changes'}
							onCancel={() => closeModal()}
						/>
					</div>
				</form>
			</div>
		</Modal>
	);
};
