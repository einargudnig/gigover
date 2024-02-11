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
import { UseResourceModal } from './modals/UseResourceModal';
import { ToolsIcon } from './icons/ToolsIcon';
import { ProcurementModal } from './modals/ProcurementModal';
import { BidModal } from './modals/BidModal';
import { ModifyProcurementModal } from './modals/ModifyProcurementModal';
import { Theme } from '../Theme';
import { AddPropertyModal } from './modals/PropertyModals/AddPropertyModal';
import { EditPropertyModal } from './modals/PropertyModals/EditPropertyModal';
import { AddUnitModal } from './modals/PropertyModals/AddUnitModal';
import { EditUnitModal } from './modals/PropertyModals/EditUnitModal';
import { PropertyIcon } from './icons/PropertyIcon';
import { ProjectToPropertyModal } from './modals/PropertyModals/ProjectToProperty';

export const GlobalModals = (): JSX.Element => {
	const [modalContext, setModalContext] = useContext(ModalContext);
	const { project } = modalContext.modifyProject || {};
	const { tender } = modalContext.addTender || {};
	const { modifyTender } = modalContext.modifyTender || {};
	const { bid } = modalContext.addBid || {};
	const { property } = modalContext.addProperty || modalContext.editProperty || {};

	return (
		<>
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
			{modalContext.addTender && (
				<Modal open={true} title={'Create tender'}>
					<ProcurementModal tender={tender} />
				</Modal>
			)}
			{modalContext.modifyTender && (
				<Modal open={true} title={'Edit tender'}>
					<ModifyProcurementModal tender={modifyTender} />
				</Modal>
			)}
			{modalContext.addBid && (
				<Modal open={true} title={'Create bid'}>
					<BidModal bid={bid} />
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
			{modalContext.propertyToProject && (
				<Modal
					title={
						<>
							<PropertyIcon size={32} color={Theme.colors.black} />
							<div>Add Property to Project</div>
						</>
					}
					open={true}
					centerModal={true}
					closeIcon={true}
					onClose={() => setModalContext({})}
				>
					<ProjectToPropertyModal
						properties={modalContext.propertyToProject.properties}
						projectId={modalContext.propertyToProject.projectId}
					/>
				</Modal>
			)}
		</>
	);
};
