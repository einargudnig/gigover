import React, { useState } from 'react';
import { Text, Box, Grid, GridItem, HStack, Spacer, Button } from '@chakra-ui/react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Link, useParams } from 'react-router-dom';
import { PropertyToProject } from '../../../models/Property';
import { useRemoveProjectFromProperty } from '../../../mutations/properties/useRemoveProjectFromProperty';

export const Projects = ({ project }): JSX.Element => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const { propertyId } = useParams();
	// console.log('projects in componet', project);

	const { mutateAsync: removeProjectFromProperty, isLoading } = useRemoveProjectFromProperty();

	return (
		<>
			<div key={project.projectId}>
				<Grid
					templateColumns="repeat(6, 1fr)"
					gap={1}
					width={'full'}
					m={1}
					alignItems={'center'}
					p={'2'}
				>
					<GridItem colSpan={2}>
						<HStack>
							<Text fontSize={'xl'} fontWeight={'bold'}>
								Project Name:
							</Text>
							<Text fontSize={'lg'}>{project.name}</Text>
						</HStack>
					</GridItem>
					<GridItem colSpan={2}>
						<HStack>
							<Text fontSize={'xl'} fontWeight={'bold'}>
								Project status:
							</Text>
							<Text fontSize={'lg'}>{project.status}</Text>
						</HStack>
					</GridItem>

					<GridItem colSpan={2}>
						<HStack>
							<Link to={`/project/${project.projectId}`}>
								<Button>Go to Project</Button>
							</Link>
							<Spacer />
							<Box>
								<ConfirmDialog
									header={`Remove Project: "${project.name}" from Property`}
									setIsOpen={setDialogOpen}
									callback={(b) => {
										if (b) {
											console.log(
												'removing project from property',
												project.name,
												'projectId:',
												project.projectId
											);
											const data: PropertyToProject = {
												projectId: project.projectId,
												propertyId: Number(propertyId)
											};
											removeProjectFromProperty(data);
										}
										setDialogOpen(false);
									}}
									isOpen={dialogOpen}
								>
									<Button
										colorScheme={'red'}
										variant={'outline'}
										onClick={() => setDialogOpen(true)}
										isLoading={isLoading}
									>
										Remove from property
									</Button>
								</ConfirmDialog>
								{/* <Button onClick={removeProject}>Remove From Property</Button> */}
							</Box>
						</HStack>
					</GridItem>
				</Grid>
			</div>
		</>
	);
};
