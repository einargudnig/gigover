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
	const [modify, { isLoading, isError, error }] = useModifyProject({
		projectId: project?.projectId
	});
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
				{project?.projectId && (
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
				<FormActions
					submitText={project ? 'Update project' : 'Create a project'}
					submitLoading={isLoading}
					submitDisabled={isLoading}
					cancelText={'Discard changes'}
					onCancel={() => closeModal()}
				/>
			</form>
		</div>
	);
};
