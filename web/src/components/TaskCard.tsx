import React, { useContext, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Task } from '../models/Task';
import { darken } from 'polished';
import { Button } from './forms/Button';
import { Input } from './forms/Input';
import { useForm } from 'react-hook-form';
import { useProjectTypes } from '../queries/useProjectTypes';
import { ModalContext } from '../context/ModalContext';
import { Label } from './Label';

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

const TaskItem = styled.div`
	height: 70px;
	display: inline-flex;
	justify-content: space-between;
	flex-direction: column;
`;

interface TaskProps {
	projectId: number;
	task?: Task;
	onSubmit?: (taskValues: Pick<Task, 'typeId' | 'text'>) => void;
}

export const TaskCard = ({ task, projectId, onSubmit }: TaskProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { data } = useProjectTypes();
	const textInputRef = useRef<HTMLInputElement>();
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

	const isEditing = Boolean(onSubmit);

	useEffect(() => {
		if (textInputRef.current) {
			textInputRef.current.focus();
		}
	}, []);

	if (!task && !onSubmit) {
		throw new Error('No task or onSubmit was supplied for Task Component');
	}

	return (
		<TaskCardStyled
			isEditing={isEditing}
			onClick={() =>
				isEditing
					? null
					: setModalContext({ taskDetails: { task: task!, projectId: projectId } })
			}
		>
			{task ? (
				<TaskItem>
					<h4>{task.text}</h4>
					<div>
						<Label
							text={
								data?.projectTypes.find((pt) => pt.typeId === task?.typeId)?.name ||
								'unknown'
							}
						/>
					</div>
				</TaskItem>
			) : (
				<form onSubmit={submit}>
					<div>
						<Input
							name={'text'}
							required={true}
							placeholder={'Write the task name'}
							ref={(e) => {
								register(e, { required: true });

								if (e) {
									textInputRef.current = e;
								}
							}}
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
