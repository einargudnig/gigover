import React from 'react';
import { Project, ProjectStatus, ProjectStatusType } from '../../models/Project';
import { Controller, useForm } from 'react-hook-form';
import { ProjectFormData, useModifyProject } from '../../queries/useModifyProject';
import { InputWrapper } from '../forms/Input';
import { useCloseModal } from '../../hooks/useCloseModal';
import { FormActions } from '../FormActions';
import { devError } from '../../utils/ConsoleUtils';
import {
	Box,
	Button,
	Divider,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Heading,
	HStack,
	Input
} from '@chakra-ui/react';
import { DatePicker } from '../forms/DatePicker';
import { InviteUser } from '../InviteUser/InviteUser';

interface ProjectModalProps {
	project?: Project;
}

export const ProjectModal = ({ project }: ProjectModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const { mutateAsync: modify, isLoading, isError, error } = useModifyProject();
	const { register, handleSubmit, errors, control } = useForm<ProjectFormData>({
		defaultValues: project,
		mode: 'onBlur'
	});

	const onSubmit = handleSubmit(async ({ name, description, startDate, endDate }) => {
		try {
			await modify({
				projectId: project?.projectId,
				name,
				description,
				startDate,
				endDate,
				status: project?.status || 'OPEN'
			});
			closeModal();
		} catch (e) {
			devError('Error', e);
		}
	});

	const updateStatus = async (status: string) => {
		try {
			const projectId = project?.projectId;

			if (projectId) {
				await modify({
					projectId,
					status: status as ProjectStatusType
				});
				closeModal();
			}
		} catch (e) {
			devError('Error', e);
		}
	};

	return (
		<div>
			{isError && (
				<>
					{/* Server errors */}
					<p>{error?.errorText}</p>
					<small>{error?.errorCode}</small>
				</>
			)}
			<form onSubmit={onSubmit}>
				<FormControl id={'name'} isRequired isInvalid={Boolean(errors.name)}>
					<FormLabel>Project name</FormLabel>
					<Input
						name="name"
						required={true}
						ref={register({ required: 'The project name is missing' })}
					/>
					{errors.name ? (
						<FormErrorMessage>{errors.name.message}</FormErrorMessage>
					) : (
						<FormHelperText>Give your project a name</FormHelperText>
					)}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'description'} isRequired isInvalid={Boolean(errors.description)}>
					<FormLabel>Project description</FormLabel>
					<Input name="description" required={true} ref={register} />
					{errors.description ? (
						<FormErrorMessage>{errors.description.message}</FormErrorMessage>
					) : (
						<FormHelperText>Describe your project</FormHelperText>
					)}
				</FormControl>
				<Box mb={6} />
				<FormControl>
					<FormLabel htmlFor="startDate">Start and end date</FormLabel>
					<HStack>
						<Controller
							name="startDate"
							control={control}
							defaultValue={project?.startDate ? new Date(project.startDate) : null}
							render={({ onChange, value, onBlur }) => (
								<DatePicker
									selected={value}
									onChange={(date) => {
										if (date) {
											onChange((date as Date).getTime());
										} else {
											onChange(null);
										}
									}}
									onBlur={onBlur}
								/>
							)}
						/>
						<Controller
							name="endDate"
							control={control}
							defaultValue={project?.endDate ? new Date(project.endDate) : null}
							render={({ onChange, value, onBlur }) => (
								<DatePicker
									selected={value}
									onChange={(date) => {
										if (date) {
											onChange((date as Date).getTime());
										} else {
											onChange(null);
										}
									}}
									onBlur={onBlur}
								/>
							)}
						/>
					</HStack>
					{errors.startDate || errors.endDate ? (
						<FormErrorMessage>
							{errors.startDate?.message || errors.endDate?.message}
						</FormErrorMessage>
					) : (
						<FormHelperText>
							When should this project start and be finished?
						</FormHelperText>
					)}
				</FormControl>

				<FormActions
					submitText={project ? 'Update project' : 'Create a project'}
					submitLoading={isLoading}
					submitDisabled={isLoading}
					cancelText={'Discard changes'}
					onCancel={() => closeModal()}
				/>
			</form>
			{project?.projectId && project.status === ProjectStatus.OPEN ? (
				<InputWrapper>
					<Button
						type={'button'}
						size={'0'}
						variant={'link'}
						colorScheme={'red'}
						onClick={async (event) => {
							event.preventDefault();
							await updateStatus(ProjectStatus.CLOSED);
						}}
					>
						Close this project
					</Button>
				</InputWrapper>
			) : project?.projectId ? (
				<InputWrapper>
					<Button
						type={'button'}
						size={'0'}
						variant={'link'}
						colorScheme={'red'}
						onClick={async (event) => {
							event.preventDefault();
							await updateStatus(ProjectStatus.OPEN);
						}}
					>
						Re-open this project
					</Button>
				</InputWrapper>
			) : null}
			{project?.projectId && project.status === ProjectStatus.CLOSED && (
				<InputWrapper>
					<Button
						type={'button'}
						size={'0'}
						colorScheme={'red'}
						variant={'link'}
						onClick={async (event) => {
							event.preventDefault();
							await updateStatus(ProjectStatus.DONE);
						}}
					>
						Archive this project
					</Button>
				</InputWrapper>
			)}
			{project && project.projectId && (
				<div>
					<Divider mb={4} />
					<Heading size={'md'} mb={4}>
						Invite users to {project.name}
					</Heading>
					<InviteUser projectId={project.projectId} />
				</div>
			)}
		</div>
	);
};
