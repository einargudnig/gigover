import React from 'react';
import styled, { css } from 'styled-components';
import { Task } from '../models/Task';
import { darken } from 'polished';
import { Button } from './forms/Button';

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
`;

interface TaskProps {
	task?: Task;
	onSubmit?: (taskValues: Pick<Task, 'typeId' | 'text'>) => void;
}

export const TaskCard = ({ task, onSubmit }: TaskProps): JSX.Element => {
	if (!task && !onSubmit) {
		throw new Error('No task or onSubmit was supplied for Task Component');
	}

	return (
		<TaskCardStyled isEditing={Boolean(onSubmit)}>
			{task ? (
				<h4>{task.text}</h4>
			) : (
				<div>
					<h4>Input</h4>
					<div>Input...</div>
					<Button
						size={'tiny'}
						appearance={'outline'}
						onClick={() => {
							if (onSubmit) {
								onSubmit({
									typeId: 1,
									text: 'Input'
								});
							}
						}}
					>
						Save
					</Button>
				</div>
			)}
		</TaskCardStyled>
	);
};
