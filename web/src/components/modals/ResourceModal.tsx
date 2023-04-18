import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useCloseModal } from '../../hooks/useCloseModal';
import { FormActions } from '../FormActions';
import {
	Box,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	HStack,
	Input,
	Tag
} from '@chakra-ui/react';
import { ModalContext } from '../../context/ModalContext';
import { useModifyResource } from '../../mutations/useModifyResource';
import { devError } from '../../utils/ConsoleUtils';
import { Resource, ResourceStatus } from '../../models/Resource';
import { Modal } from '../Modal';
import { Tabs } from '../tabs/Tabs';
import styled, { css } from 'styled-components';
import { LoadingSpinner } from '../LoadingSpinner';
import { TrackerSelect } from '../TrackerSelect';
import { useResourceTypes } from '../../queries/useResourceTypes';
import { ResourceHistoryLog } from '../Resources/ResourceHistoryLog';
import { ResourceComments } from '../Resources/ResourceComments';
import { CommentInput } from '../Resources/ResourceCommentInput';

const TabContent = styled.div<{ show: boolean }>`
	background: #f9f9f9;
	padding: ${(props) => props.theme.padding(3)};
	visibility: visible;
	position: relative;

	${(props) =>
		!props.show &&
		css`
			visibility: hidden;
			position: absolute;
		`};
`;

export const ResourceModal = (): JSX.Element => {
	const closeModal = useCloseModal();
	const [{ resources }] = useContext(ModalContext);
	const { data: resourceTypes, isLoading: isLoadingResourceTypes } = useResourceTypes();
	const { mutateAsync, isLoading, isError, error } = useModifyResource();
	const {
		register,
		handleSubmit,
		formState: { errors },
		control
	} = useForm<Resource>({
		defaultValues: resources?.resource,
		mode: 'onBlur'
	});

	const onSubmit = handleSubmit(async (values) => {
		try {
			await mutateAsync({
				...resources?.resource,
				...values
			});
			closeModal();
		} catch (e) {
			devError('Error', e);
		}
	});

	const isEditing = Boolean(resources?.resource?.id);

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
										required={true}
										{...register('name', {
											required: 'The resource name is missing'
										})}
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
										required={true}
										{...register('serialNr', {
											required: 'The resource ID is missing'
										})}
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
							<HStack mb={4} spacing={4} justifyContent={'space-between'}>
								<Tag>Resource Type</Tag>
								{isLoadingResourceTypes && <LoadingSpinner />}
							</HStack>
							<Controller
								name={'type'}
								control={control}
								render={({ field: { onChange, value } }) => (
									<TrackerSelect
										title={'Select type'}
										value={value}
										options={
											resourceTypes?.areas?.map((type) => ({
												value: type.type,
												label: type.name
											})) ?? []
										}
										valueChanged={(newValue) => onChange(newValue)}
									/>
								)}
							/>
							<Box mb={6} />
							{isEditing && (
								<>
									<HStack mb={4} spacing={4} justifyContent={'space-between'}>
										<Tag>Resource Status</Tag>
									</HStack>
									<Controller
										name={'status'}
										control={control}
										render={({ field: { onChange, value } }) => (
											<TrackerSelect
												title={'Select status'}
												value={value}
												options={[
													{
														value: ResourceStatus.Available,
														label: 'Available'
													},
													{
														value: ResourceStatus.InUse,
														label: 'In use'
													},
													{
														value: ResourceStatus.NotAvailable,
														label: 'Not available'
													}
												]}
												valueChanged={(newValue) => onChange(newValue)}
											/>
										)}
									/>
									<Box mb={6} />
								</>
							)}
							<Tabs
								labelKey={'name'}
								defaultTab={
									isEditing
										? { name: 'Resource log', value: 0 }
										: { name: 'Resource details', value: 1 }
								}
								tabs={Array.from(
									isEditing ? [{ name: 'Resource log', value: 0 }] : []
								)
									.concat([
										{ name: 'Resource details', value: 1 },
										{ name: 'Resource cost', value: 2 },
										{ name: 'Description', value: 3 }
									])
									.concat(isEditing ? [{ name: 'Comments', value: 4 }] : [])}
							>
								{({ tab }) => (
									<>
										<TabContent show={tab.value === 0}>
											{isEditing && resources?.resource && (
												<ResourceHistoryLog resource={resources.resource} />
											)}
										</TabContent>
										<TabContent show={tab.value === 1}>
											<FormControl
												id={'make'}
												isInvalid={Boolean(errors.make)}
												mb={6}
											>
												<FormLabel>Resource make</FormLabel>
												<Input bg={'white'} name={'make'} {...register} />
												{errors.make && (
													<FormErrorMessage>
														{errors.make.message}
													</FormErrorMessage>
												)}
											</FormControl>
											<FormControl
												id={'model'}
												isInvalid={Boolean(errors.model)}
												mb={6}
											>
												<FormLabel>Resource model</FormLabel>
												<Input bg={'white'} name={'model'} {...register} />
												{errors.model && (
													<FormErrorMessage>
														{errors.model.message}
													</FormErrorMessage>
												)}
											</FormControl>
											<FormControl
												id={'year'}
												isInvalid={Boolean(errors.year)}
											>
												<FormLabel>Resource year</FormLabel>
												<Input
													bg={'white'}
													name="year"
													{...register}
													type="number"
												/>
												{errors.year && (
													<FormErrorMessage>
														{errors.year.message}
													</FormErrorMessage>
												)}
											</FormControl>
										</TabContent>
										<TabContent show={tab.value === 2}>
											<FormControl
												id={'cost'}
												isInvalid={Boolean(errors.cost)}
												mb={6}
											>
												<FormLabel>Resource cost</FormLabel>
												<Input
													name="cost"
													{...register}
													type="number"
													min={0}
													bg={'white'}
												/>
												{errors.cost ? (
													<FormErrorMessage>
														{errors.cost.message}
													</FormErrorMessage>
												) : (
													<FormHelperText>
														What is the hourly rental cost?
													</FormHelperText>
												)}
											</FormControl>
										</TabContent>
										<TabContent show={tab.value === 3}>
											<FormControl
												id={'description'}
												isInvalid={Boolean(errors.description)}
											>
												<FormLabel>Resource description</FormLabel>
												<Input
													bg={'white'}
													name="description"
													{...register}
												/>
												{errors.description ? (
													<FormErrorMessage>
														{errors.description.message}
													</FormErrorMessage>
												) : (
													<FormHelperText>
														Describe your resource
													</FormHelperText>
												)}
											</FormControl>
										</TabContent>
										{isEditing && resources?.resource && (
											<TabContent show={tab.value === 4}>
												<ResourceComments resource={resources.resource} />
												<CommentInput resourceId={resources.resource.id!} />
											</TabContent>
										)}
									</>
								)}
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
