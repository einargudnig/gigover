import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { Task } from '../models/Task';
import { darken } from 'polished';
import { useProjectTypes } from '../queries/useProjectTypes';
import { ModalContext } from '../context/ModalContext';
import { Label } from './Label';
import { TaskCardInput } from './TaskCardInput';

const TaskCardStyled = styled.div<{ isEditing: boolean; error?: boolean }>`
	padding: 16px;
	margin: 8px 0;
	background: ${(props) => props.theme.colors.taskBackground};
	border: 1px solid ${(props) => props.theme.colors.taskBorder};
	cursor: pointer;
	border-radius: 6px;
	word-wrap: anywhere;

	h4 {
		font-weight: normal;
	}

	@media screen and (max-width: 1024px) {
		padding: 12px;

		h4 {
			font-size: 15px;
		}
	}

	@media screen and (max-width: 768px) {
		padding: 8px;

		h4 {
			font-size: 14px;
		}
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

	${(props) =>
		props.isEditing &&
		props.error &&
		css`
			border-color: ${props.theme.colors.red};
			box-shadow: 0 5px 25px rgba(222, 39, 39, 0.2);
		`};
`;

const TaskItem = styled.div`
	min-height: 70px;
	display: inline-flex;
	justify-content: space-between;
	flex-direction: column;

	@media screen and (max-width: 768px) {
		min-width: 240px;
	}
`;

interface TaskProps {
	projectId: number;
	error?: string;
	loading?: boolean;
	task?: Task;
	onSubmit?: (taskValues: Pick<Task, 'typeId' | 'text'>) => void;
}

export const TaskCard = ({
	task,
	projectId,
	onSubmit,
	loading = false,
	error
}: TaskProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { data } = useProjectTypes();
	const isEditing = Boolean(onSubmit);

	if (!task && !onSubmit) {
		throw new Error('No task or onSubmit was supplied for Task Component');
	}

	return (
		<TaskCardStyled
			error={Boolean(error)}
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
							style={{ display: 'inline-block', marginTop: 16 }}
							text={
								data?.projectTypes.find((pt) => pt.typeId === task?.typeId)?.name ||
								'unknown'
							}
						/>
					</div>
				</TaskItem>
			) : (
				<TaskCardInput loading={loading} error={error} onSubmit={onSubmit} />
			)}
		</TaskCardStyled>
	);
};
