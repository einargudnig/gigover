import React from 'react';
import { Project, ProjectStatus } from '../../models/Project';
import { useForm } from 'react-hook-form';
import { ProjectFormData, useModifyProject } from '../../queries/useModifyProject';
import { Label } from '../forms/Label';
import { InputWrapper } from '../forms/Input';
import { useCloseModal } from '../../hooks/useCloseModal';
import { FormActions } from '../FormActions';
import { devError } from '../../utils/ConsoleUtils';
import { Button, Input } from '@chakra-ui/react';

interface ProjectModalProps {
	project?: Project;
}

export const ProjectModal = ({ project }: ProjectModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const { mutateAsync: modify, isLoading, isError, error } = useModifyProject();
	const { register, handleSubmit, errors } = useForm<ProjectFormData>({
		defaultValues: project
	});

	const onSubmit = handleSubmit(async ({ name, description }) => {
		// TODO Validate form..
		try {
			await modify({
				projectId: project?.projectId,
				name,
				description,
				status: project?.status || 'OPEN'
			});
			closeModal();
		} catch (e) {
			devError('Error', e);
		}
	});

	const reOpenProject = async () => {
		try {
			const projectId = project?.projectId;

			if (projectId) {
				await modify({
					projectId,
					status: ProjectStatus.OPEN
				});
				closeModal();
			}
		} catch (e) {
			devError('Error', e);
		}
	};

	const setClosed = async () => {
		try {
			const projectId = project?.projectId;

			if (projectId) {
				await modify({
					projectId,
					status: ProjectStatus.CLOSED
				});
				closeModal();
			}
		} catch (e) {
			devError('Error', e);
		}
	};

	const archiveProject = async () => {
		try {
			const projectId = project?.projectId;

			if (projectId) {
				await modify({
					projectId,
					status: ProjectStatus.DONE
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
			{errors && (
				<>
					<ul>
						{errors.name && <li>{errors.name}</li>}
						{errors.description && <li>{errors.description}</li>}
						{errors.status && <li>{errors.status}</li>}
					</ul>
				</>
			)}
			<form onSubmit={onSubmit}>
				<Label>Project name</Label>
				<Input mb={6} name="name" required={true} ref={register} />
				<Label>Project description</Label>
				<Input mb={6} name="description" required={true} ref={register} />
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
							await setClosed();
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
							await reOpenProject();
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
							await archiveProject();
						}}
					>
						Archive this project
					</Button>
				</InputWrapper>
			)}
		</div>
	);
};
