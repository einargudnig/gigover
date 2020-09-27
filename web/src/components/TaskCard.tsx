import React from 'react';
import styled, { css } from 'styled-components';
import { Task } from '../models/Task';
import { darken } from 'polished';
import { Button } from './forms/Button';
import { Input } from './forms/Input';
import { useForm } from 'react-hook-form';
import { useProjectTypes } from '../queries/useProjectTypes';

const TaskCardStyled = styled.div<{ isEditing: boolean }>`
	padding: 16px;
	margin: 8px 0;
	background: ${(props) => props.theme.colors.taskBackground};
	border: 1px solid ${(props) => props.theme.colors.taskBorder};
	cursor: pointer;
	border-radius: 6px;

	h4 {
		font-weight: normal;
	}

	${(props) =>
		!props.isEditing &&
		css`
			&:hover {
				background: ${darken(0.05, props.theme.colors.taskBackground)};
				border: 1px solid ${darken(0.05, props.theme.colors.taskBorder)};
			}
		`}

	${(props) =>
		props.isEditing &&
		css`
			border-color: ${props.theme.colors.green};
			box-shadow: 0 5px 25px rgba(0, 140, 0, 0.2);
		`};
`;

interface TaskProps {
	task?: Task;
	onSubmit?: (taskValues: Pick<Task, 'typeId' | 'text'>) => void;
}

export const TaskCard = ({ task, onSubmit }: TaskProps): JSX.Element => {
	const { data } = useProjectTypes();
	const { register, handleSubmit } = useForm<Pick<Task, 'typeId' | 'text'>>({
		defaultValues: {
			text: ''
		}
	});

	const submit = handleSubmit(async (values) => {
		if (onSubmit) {
			onSubmit({
				text: values.text,
				// Sending string because of the select value..
				typeId: parseInt(values.typeId.toString())
			});
		}
	});

	if (!task && !onSubmit) {
		throw new Error('No task or onSubmit was supplied for Task Component');
	}

	return (
		<TaskCardStyled isEditing={Boolean(onSubmit)}>
			{task ? (
				<h4>{task.text}</h4>
			) : (
				<form onSubmit={submit}>
					<div>
						<Input
							name={'text'}
							required={true}
							placeholder={'Write the task name'}
							ref={register}
						/>
					</div>
					<div>
						<select name="typeId" ref={register}>
							{data?.projectTypes.map((projectType) => (
								<option key={projectType.typeId} value={projectType.typeId}>
									{projectType.name}
								</option>
							))}
						</select>
					</div>
					<Button size={'tiny'} type={'submit'} appearance={'outline'}>
						Save
					</Button>
				</form>
			)}
		</TaskCardStyled>
	);
};
