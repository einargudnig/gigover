import { Button } from '@chakra-ui/react';
import { useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { EmptyProjects } from './EmptyProjects';
import { EmptyState } from './EmptyState';
import { DisabledComponent } from '../disabled/DisabledComponent';

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
				<DisabledComponent>
					<Button onClick={() => setModalContext({ modifyProject: {} })}>
						Create a project
					</Button>
				</DisabledComponent>
			}
		/>
	);
};
