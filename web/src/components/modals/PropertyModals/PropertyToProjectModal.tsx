import React, { useState } from 'react';
import { IProperties, PropertyToProject } from '../../../models/Property';
import { TrackerSelect } from '../../TrackerSelect';
import { Button, Flex } from '@chakra-ui/react';
import { useAddProjectToProperty } from '../../../mutations/properties/useAddProjectToProperty';

interface PropertyToProjectModalProps {
	properties: IProperties[];
	projectId: number;
}

export const PropertyToProjectModal = ({
	properties,
	projectId
}: PropertyToProjectModalProps): JSX.Element => {
	const [selectedProperty, setSelectedProperty] = useState<IProperties | undefined>();
	const { mutateAsync: addProjectToProperty } = useAddProjectToProperty();

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
	};

	return (
		<>
			<p>Choose a property to add to this project</p>
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
						setSelectedProperty(properties.find((p) => p.propertyId === propertyId)!);
					}
				}}
			/>
			{selectedProperty && (
				<Flex marginTop={2} justifyContent={'flex-end'}>
					{/* <Button onClick={() => console.log('cancel')}>Remove</Button>
					<Spacer /> */}
					<Button onClick={() => addProject()}>Add Property to Project</Button>
				</Flex>
			)}
		</>
	);
};
