import { useContext } from 'react';
import { Theme } from '../Theme';
import { ModalContext } from '../context/ModalContext';
import ShareItem from '../pages/Files/components/ShareItem';
import { Modal } from './Modal';
// import { PropertyIcon } from './icons/PropertyIcon';
import { ToolsIcon } from './icons/ToolsIcon';
import { EditTimeTrackerModal } from './modals/EditTimeTrackerModal';
import { MilestoneModal } from './modals/MilestoneModal';
import { ProjectModal } from './modals/ProjectModal';
import { AddPropertyModal } from './modals/PropertyModals/AddPropertyModal';
import { AddUnitModal } from './modals/PropertyModals/AddUnitModal';
import { EditPropertyModal } from './modals/PropertyModals/EditPropertyModal';
import { EditUnitModal } from './modals/PropertyModals/EditUnitModal';
// import { ProjectToPropertyModal } from './modals/PropertyModals/ProjectToProperty';
import { ResourceModal } from './modals/ResourceModal';
import { NewTaskModal } from './modals/TaskModal/NewTaskModal';
import { TimeTrackerModal } from './modals/TimeTrackerModal';
import { UseResourceModal } from './modals/UseResourceModal';

export const GlobalModals = (): JSX.Element => {
	const [modalContext, setModalContext] = useContext(ModalContext);
	const { project } = modalContext.modifyProject || {};
	const { property } = modalContext.addProperty || modalContext.editProperty || {};

	return (
		<>
			{modalContext.taskDetails && (
				<NewTaskModal
					open={true}
					title={'Edit Task'}
					onClose={() => setModalContext({})}
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
			{modalContext.resources && <ResourceModal />}
			{modalContext.shareItem && (
				<Modal open={true} title={'Share options'} onClose={() => setModalContext({})}>
					<ShareItem shareItem={modalContext.shareItem} />
				</Modal>
			)}
			{modalContext.addProperty && (
				<Modal open={true} title={'Create property'}>
					<AddPropertyModal property={property} />
				</Modal>
			)}
			{modalContext.editProperty && (
				<Modal open={true} title={'Edit property'}>
					<EditPropertyModal property={property} />
				</Modal>
			)}
			{modalContext.addUnit && (
				<Modal open={true} title={'Create unit'}>
					<AddUnitModal
						unit={modalContext.addUnit.unit}
						propertyId={modalContext.addUnit.propertyId}
					/>
				</Modal>
			)}
			{modalContext.editUnit && (
				<Modal open={true} title={'Edit unit'}>
					<EditUnitModal
						unit={modalContext.editUnit.unit}
						propertyId={modalContext.editUnit.propertyId}
					/>
				</Modal>
			)}
			{modalContext.resourceTracker && (
				<Modal
					title={
						<>
							<ToolsIcon size={32} color={Theme.colors.black} type={'solid'} />
							<div>Resources</div>
						</>
					}
					open={true}
					centerModal={true}
					closeIcon={true}
					onClose={() => setModalContext({})}
				>
					<UseResourceModal resourceTracker={modalContext.resourceTracker} />
				</Modal>
			)}
			{/* {modalContext.propertyToProject && ( */}
			{/* 	<Modal */}
			{/* 		title={ */}
			{/* 			<> */}
			{/* 				<PropertyIcon size={32} color={Theme.colors.black} /> */}
			{/* 				<div>Add Property to Project</div> */}
			{/* 			</> */}
			{/* 		} */}
			{/* 		open={true} */}
			{/* 		centerModal={true} */}
			{/* 		closeIcon={true} */}
			{/* 		onClose={() => setModalContext({})} */}
			{/* 	> */}
			{/* 		<ProjectToPropertyModal */}
			{/* 			onClose={() => setModalContext({})} */}
			{/* 			isOpen={true} */}
			{/* 			projectId={modalContext.propertyToProject.projectId} */}
			{/* 		/> */}
			{/* 	</Modal> */}
			{/* )} */}
		</>
	);
};
