import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { Task } from '../models/Task';
import { darken } from 'polished';
import { useProjectTypes } from '../queries/useProjectTypes';
import { ModalContext } from '../context/ModalContext';
import { Label } from './Label';
import { TaskCardInput } from './TaskCardInput';
import { CardBase } from './CardBase';
import { FileUploadType } from '../models/FileUploadType';
import { DropZone } from './DropZone';
import { Avatar, Flex } from '@chakra-ui/react';

const TaskCardStyled = styled(CardBase)<{
	isEditing: boolean;
	error?: boolean;
	isDragActive: boolean;
}>`
	padding: 16px;
	margin: 8px 0;
	cursor: pointer;
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
			}
		`}

	${(props) =>
		props.isEditing &&
		css`
			box-shadow: 0 5px 25px rgba(0, 140, 0, 0.2);
		`};

	${(props) =>
		props.isEditing &&
		props.error &&
		css`
			box-shadow: 0 5px 25px rgba(222, 39, 39, 0.2);
		`};

	${(props) =>
		props.isDragActive &&
		css`
			outline: 3px solid ${props.theme.colors.green};
		`}
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
	onSubmit?: (taskValues: Pick<Task, 'typeId' | 'subject'>) => void;
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
		<DropZone
			offerId={0}
			projectId={projectId}
			tenderId={0}
			uploadType={FileUploadType.Task}
			externalId={task?.taskId}
		>
			{({ isDragActive }) => (
				<TaskCardStyled
					isDragActive={isDragActive}
					error={Boolean(error)}
					isEditing={isEditing}
					onClick={() =>
						isEditing
							? null
							: setModalContext({
									taskDetails: {
										task: task!,
										projectId: projectId
									}
							  })
					}
				>
					{task ? (
						<TaskItem>
							<h4>{task.subject}</h4>
							<Flex mt={4} align={'center'}>
								<Label
									style={{ display: 'inline-block' }}
									text={
										data?.projectTypes.find((pt) => pt.typeId === task?.typeId)
											?.name || 'unknown'
									}
								/>
								{task.worker && <Avatar size="xs" ml={2} name={task.worker.name} />}
							</Flex>
						</TaskItem>
					) : (
						<TaskCardInput loading={loading} error={error} onSubmit={onSubmit} />
					)}
				</TaskCardStyled>
			)}
		</DropZone>
	);
};
