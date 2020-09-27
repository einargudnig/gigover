import React from 'react';
import styled from 'styled-components';
import { Modal } from '../Modal';
import { Task } from '../../models/Task';
import { useCloseModal } from '../../hooks/useCloseModal';

const TaskModalStyled = styled.div``;

interface TaskModalProps {
	task: Task;
}

export const TaskModal = ({ task }: TaskModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	return (
		<Modal open={true} title={task.text} onClose={closeModal}>
			Task window!
		</Modal>
	);
};
