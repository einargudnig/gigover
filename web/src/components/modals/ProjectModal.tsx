import React, { useContext } from 'react';
import { Project } from '../../models/Project';
import { useForm } from 'react-hook-form';
import { ProjectFormData, useModifyProject } from '../../queries/useModifyProject';
import { Label } from '../forms/Label';
import { Input, InputWrapper } from '../forms/Input';
import { ModalContext } from '../../context/ModalContext';
import { useCloseModal } from '../../hooks/useCloseModal';

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
				status: project?.status || 1
			});
			closeModal();
		} catch (e) {
			console.log('Error', e);
		}
	});

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
				{isLoading ? (
					<button type="submit" disabled={true}>
						Loading
					</button>
				) : (
					<button type="submit">Submit</button>
				)}
			</form>
		</div>
	);
};
