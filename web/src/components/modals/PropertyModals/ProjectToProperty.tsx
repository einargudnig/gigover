import React, { useState } from 'react';
import { IProperties, PropertyToProject } from '../../../models/Property';
import { TrackerSelect } from '../../TrackerSelect';
import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { useAddProjectToProperty } from '../../../mutations/properties/useAddProjectToProperty';

interface PropertyToProjectModalProps {
	properties: IProperties[];
	projectId: number;
}

export const ProjectToPropertyModal = ({
	properties,
	projectId
}: PropertyToProjectModalProps): JSX.Element => {
	const [selectedProperty, setSelectedProperty] = useState<IProperties | undefined>();
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
			<Box marginTop={2}>
				{!selectedProperty ? (
					<Flex justifyContent={'flex-start'}>
						<Button>View Properties</Button>
					</Flex>
				) : null}
				{selectedProperty && (
					<Flex marginTop={2} justifyContent={'justify-between'}>
						<Box>
							<Flex justifyContent={'flex-start'}>
								<Button>View Properties</Button>
							</Flex>
						</Box>
						<Spacer />
						<Box>
							<Button onClick={() => addProject()} isLoading={isLoading}>
								Add Property to Project
							</Button>
						</Box>
					</Flex>
				)}
			</Box>
		</>
	);
};
