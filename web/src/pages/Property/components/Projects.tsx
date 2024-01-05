import React, { useState } from 'react';
import { Text, Box, Grid, GridItem, HStack, Spacer, Button } from '@chakra-ui/react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Link, useParams } from 'react-router-dom';
import { PropertyToProject } from '../../../models/Property';
import { useRemoveProjectFromProperty } from '../../../mutations/properties/useRemoveProjectFromProperty';

export const Projects = ({ projects }): JSX.Element => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const { propertyId } = useParams();

	const { mutateAsync: removeProjectFromProperty, isLoading } = useRemoveProjectFromProperty();

	return (
		<>
			{!projects || projects.length === 0 ? (
				// eslint-disable-next-line react/jsx-no-undef
				<Text>No projects found</Text>
			) : (
				projects.map((project) => (
					<div key={project.projectId}>
						<Grid
							templateColumns="repeat(8, 1fr)"
							gap={1}
							width={'full'}
							m={1}
							alignItems={'center'}
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
											header={'Remove Project from Property'}
											setIsOpen={setDialogOpen}
											callback={(b) => {
												if (b) {
													console.log(
														'removing project from property',
														project.projectId,
														propertyId
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
												Remove
											</Button>
										</ConfirmDialog>
									</Box>
								</HStack>
							</GridItem>
						</Grid>
					</div>
				))
			)}
		</>
	);
};
