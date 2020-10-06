import React from 'react';
import { Project, ProjectStatus } from '../../models/Project';
import { useForm } from 'react-hook-form';
import { ProjectFormData, useModifyProject } from '../../queries/useModifyProject';
import { Label } from '../forms/Label';
import { Input, InputWrapper } from '../forms/Input';
import { useCloseModal } from '../../hooks/useCloseModal';
import { FormActions } from '../FormActions';
import { Button } from '../forms/Button';

interface ProjectModalProps {
	project?: Project;
}

export const ProjectModal = ({ project }: ProjectModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const [modify, { isLoading, isError, error }] = useModifyProject();
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
			console.log('Error', e);
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
			console.log('Error', e);
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
			console.log('Error', e);
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
			console.log('Error', e);
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
				<InputWrapper>
					<Label>Heiti verkefnis</Label>
					<Input name="name" required={true} ref={register} />
				</InputWrapper>
				<InputWrapper>
					<Label>Lýsing á verkefni</Label>
					<Input name="description" required={true} ref={register} />
				</InputWrapper>
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
						size={'none'}
						appearance={'delete'}
						onClick={async (event) => {
							event.preventDefault();
							await setClosed();
						}}
					>
						Close this project
					</Button>
				</InputWrapper>
			) : (
				<InputWrapper>
					<Button
						type={'button'}
						size={'none'}
						appearance={'delete'}
						onClick={async (event) => {
							event.preventDefault();
							await reOpenProject();
						}}
					>
						Re-open this project
					</Button>
				</InputWrapper>
			)}
			{project?.projectId && project.status === ProjectStatus.CLOSED && (
				<InputWrapper>
					<Button
						type={'button'}
						size={'none'}
						appearance={'delete'}
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
