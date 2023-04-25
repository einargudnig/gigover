import React, { useState } from 'react';
import { Project, ProjectStatus, ProjectStatusType } from '../../models/Project';
import { Controller, useForm } from 'react-hook-form';
import { ProjectFormData, useModifyProject } from '../../mutations/useModifyProject';
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
import { useProjectList } from '../../queries/useProjectList';
import { useQueryClient } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { GetNextLexoRank } from '../../utils/GetNextLexoRank';
import { useProgressStatusList } from '../../queries/useProgressStatusList';
import { ProgressStatus } from '../../models/ProgressStatus';
import CreatableSelect from 'react-select/creatable';

interface ProjectModalProps {
	project?: Project;
}

export const ProjectModal = ({ project }: ProjectModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const queryClient = useQueryClient();
	const { data: progressStatuses } = useProgressStatusList();
	const { data: projects } = useProjectList();
	const [progressStatus, setProgressStatus] = useState(
		project?.progressStatus
			? {
					name: project?.progressStatus,
					id: -1
			  }
			: undefined
	);
	const { mutateAsync: modify, isLoading, isError, error } = useModifyProject();
	const {
		register,
		handleSubmit,
		formState: { errors },
		control
	} = useForm<ProjectFormData>({
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
				lexoRank: GetNextLexoRank(projects, -1, 0).toString(),
				status: project?.status || 'OPEN',
				progressStatus: progressStatus?.name ?? null
			});

			queryClient.refetchQueries(ApiService.projectList);
			queryClient.refetchQueries(ApiService.getProgressStatusList);
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
						required={true}
						{...register('name', { required: 'The project name is missing' })}
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
					<Input required={true} {...register('description')} />
					{errors.description ? (
						<FormErrorMessage>{errors.description.message}</FormErrorMessage>
					) : (
						<FormHelperText>Describe your project</FormHelperText>
					)}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'progressStatus'}>
					<FormLabel>
						Progress (optional) - Select or create a new one (Press enter after creating
						a new status)
					</FormLabel>
					<CreatableSelect
						theme={(theme) => ({
							...theme,
							borderRadius: 8,
							colors: {
								...theme.colors,
								neutral20: 'var(--chakra-colors-gray-200)',
								neutral30: 'var(--chakra-colors-gray-400)',
								primary25: 'var(--chakra-colors-yellow-100)',
								primary50: 'var(--chakra-colors-yellow-200)',
								primary75: 'var(--chakra-colors-yellow-300)',
								primary: 'var(--chakra-colors-yellow-400)'
							}
						})}
						onChange={(newValue, actionMeta) => {
							if (actionMeta.action === 'create-option') {
								const createdValue = newValue as unknown as {
									label: string;
									value: string;
								};
								setProgressStatus({ id: -1, name: createdValue.label });
							} else {
								setProgressStatus(newValue as unknown as ProgressStatus);
							}
						}}
						getOptionLabel={(option: unknown) => (option as ProgressStatus).name}
						getOptionValue={(option: unknown) => {
							return (option as ProgressStatus).id as unknown as string;
						}}
						value={progressStatus}
						options={progressStatuses?.progressStatusList || []}
					/>
				</FormControl>
				<Box mb={6} />
				<FormControl>
					<FormLabel htmlFor="startDate">Start and end date</FormLabel>
					<HStack>
						<Controller
							name="startDate"
							control={control}
							defaultValue={
								project?.startDate
									? (project.startDate.valueOf() as number)
									: undefined
							}
							render={({ field: { onChange, value, onBlur } }) => (
								<DatePicker
									selected={value ? new Date(value) : null}
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
							defaultValue={
								project?.endDate ? (project.endDate.valueOf() as number) : undefined
							}
							render={({ field: { onChange, value, onBlur } }) => (
								<DatePicker
									selected={value ? new Date(value) : null}
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
					{project.owner && (
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
					)}
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
			{project && project.projectId && project.owner && (
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
