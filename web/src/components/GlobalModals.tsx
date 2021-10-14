import React, { useContext } from 'react';
import { ModalContext } from '../context/ModalContext';
import { Modal } from './Modal';
import { RegistrationModal } from './modals/RegistrationModal';
import { ProjectModal } from './modals/ProjectModal';
import { TimeTrackerModal } from './modals/TimeTrackerModal';
import { TaskModal } from './modals/TaskModal/TaskModal';
import { EditTimeTrackerModal } from './modals/EditTimeTrackerModal';
import { MilestoneModal } from './modals/MilestoneModal';
import { ResourceModal } from './modals/ResourceModal';
import ShareItem from '../pages/Files/components/ShareItem';

export const GlobalModals = ({ children }: { children: React.ReactNode }): JSX.Element => {
	const [modalContext, setModalContext] = useContext(ModalContext);
	const { project } = modalContext.modifyProject || {};

	return (
		<>
			{children}
			{modalContext.taskDetails && (
				<TaskModal
					task={modalContext.taskDetails.task}
					projectId={modalContext.taskDetails.projectId}
				/>
			)}
			{modalContext.timeTracker && <TimeTrackerModal context={modalContext.timeTracker} />}
			{modalContext.editTimeTracker && (
				<EditTimeTrackerModal context={modalContext.editTimeTracker} />
			)}
			{modalContext.milestone && <MilestoneModal context={modalContext.milestone} />}
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
			{modalContext.resources && <ResourceModal />}
			{modalContext.shareItem && (
				<Modal open={true} title={'Share options'} onClose={() => setModalContext({})}>
					<ShareItem shareItem={modalContext.shareItem} />
				</Modal>
			)}
		</>
	);
};
