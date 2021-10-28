import React, { useContext } from 'react';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { Resource } from '../models/Resource';
import { ToolsIcon } from './icons/ToolsIcon';
import { IconButton } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';

export interface OpenResourceModalButtonProps {
	project: Project;
	task?: Task;
	resource?: Resource;
}

export const OpenResourceModalButton = ({
	project,
	task,
	resource
}: OpenResourceModalButtonProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	return (
		<IconButton
			aria-label={'Use resource'}
			variant={'outline'}
			colorScheme={'gray'}
			onClick={() => {
				setModalContext({
					resourceTracker: {
						resource,
						project,
						task
					}
				});
			}}
			icon={<ToolsIcon />}
		/>
	);
};
