import React, { useContext } from 'react';
import { ModalContext } from '../context/ModalContext';
import { Modal } from './Modal';
import { RegistrationModal } from './modals/RegistrationModal';
import { ProjectModal } from './modals/ProjectModal';
import { TimeTrackerModal } from './modals/TimeTrackerModal';
import { TaskModal } from './modals/TaskModal';

export const GlobalModals = ({ children }: { children: React.ReactNode }): JSX.Element => {
	const [modalContext, setModalContext] = useContext(ModalContext);
	const { project } = modalContext.modifyProject || {};

	// Todo do same thing for Project that was done for Timetracker.. much cleanr

	return (
		<>
			{children}
			{modalContext.task && <TaskModal task={modalContext.task} />}
			{modalContext.timeTracker && (
				<TimeTrackerModal open={true} context={modalContext.timeTracker} />
			)}
			{modalContext.modifyProject && (
				<Modal
					open={true}
					title={!project ? 'Create a new project' : `Edit ${project.name}`}
					onClose={() => setModalContext({})}
				>
					<ProjectModal project={project} />
				</Modal>
			)}
			{modalContext.registered === false && (
				<Modal open={true} title={'Setup your account'}>
					<RegistrationModal />
				</Modal>
			)}
		</>
	);
};
