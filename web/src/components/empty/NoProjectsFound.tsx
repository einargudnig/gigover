import { Button, Tooltip } from '@chakra-ui/react';
import { useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { EmptyProjects } from './EmptyProjects';
import { EmptyState } from './EmptyState';
import { useGetUserPrivileges } from '../../hooks/useGetUserPrivileges';

export const NoProjectsFound = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { privileges, activeOrg } = useGetUserPrivileges();

	return (
		<EmptyState
			icon={<EmptyProjects />}
			title={'No projects found'}
			text={
				'Seems that you haven’t created any projects\n' +
				'for you and your organisation yet. Why don’t you add a new project to your project manager.'
			}
			action={
				activeOrg ? (
					<>
						{privileges.includes('ADMIN') || privileges.includes('EDITOR') ? (
							<Button onClick={() => setModalContext({ modifyProject: {} })}>
								Create a project
							</Button>
						) : (
							<Tooltip label="You do not have permissions!">
								<Button isDisabled>New project</Button>
							</Tooltip>
						)}
					</>
				) : (
					<Button onClick={() => setModalContext({ modifyProject: {} })}>
						Create a project
					</Button>
				)
			}
		/>
	);
};
