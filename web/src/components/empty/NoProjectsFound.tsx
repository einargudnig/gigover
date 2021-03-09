import React, { useContext } from 'react';
import { EmptyState } from './EmptyState';
import { EmptyProjects } from './EmptyProjects';
import { Button } from '@chakra-ui/react';
import { ModalContext } from '../../context/ModalContext';

export const NoProjectsFound = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	return (
		<EmptyState
			icon={<EmptyProjects />}
			title={'No projects found'}
			text={
				'Seems that you haven’t created any projects\n' +
				'for you and your organisation yet. Why don’t you add a new project to your project manager.'
			}
			action={
				<Button onClick={() => setModalContext({ modifyProject: {} })}>
					Create a project
				</Button>
			}
		/>
	);
};
