import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IProperties, PropertyToProject } from '../../../models/Property';
import { useAddProjectToProperty } from '../../../mutations/properties/useAddProjectToProperty';
import { TrackerSelect } from '../../TrackerSelect';
import { useGetProperties } from '../../../queries/properties/useGetPoperties';

interface PropertyToProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: number;
}

export const ProjectToPropertyModal = ({
	isOpen,
	onClose,
	projectId
}: PropertyToProjectModalProps): JSX.Element => {
	const [selectedProperty, setSelectedProperty] = useState<IProperties | undefined>();
	const { data: properties } = useGetProperties();
	const { mutateAsync: addProjectToProperty, isLoading } = useAddProjectToProperty();

	const addProject = () => {
		console.log(
			'add project',
			'projectId:',
			projectId,
			'propertyId',
			selectedProperty?.propertyId
		);
		const data: PropertyToProject = {
			projectId: projectId,
			propertyId: selectedProperty!.propertyId
		};

		addProjectToProperty(data);
		// add a timeout to allow the mutation to complete
		setTimeout(() => {
			isOpen = false;
		}, 1000);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Property to Project</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<TrackerSelect
						title={'Select a property'}
						value={selectedProperty?.propertyId}
						options={properties.map((property) => ({
							label: property.name,
							value: property.propertyId
						}))}
						isNumber={true}
						valueChanged={(newValue) => {
							if (!newValue) {
								setSelectedProperty(undefined);
							} else {
								const propertyId = newValue as number;
								setSelectedProperty(
									properties.find((p) => p.propertyId === propertyId)
								);
							}
						}}
					/>
				</ModalBody>
				<ModalFooter>
					<Flex justifyContent={'flex-end'}>
						{!selectedProperty ? (
							<Link to={'/property'}>
								<Button variant="outline" colorScheme="gray">
									View Properties
								</Button>
							</Link>
						) : (
							<Button
								variant="outline"
								colorScheme="gray"
								onClick={addProject}
								isLoading={isLoading}
							>
								Add Property to Project
							</Button>
						)}
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
