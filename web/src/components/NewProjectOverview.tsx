/* eslint-disable no-shadow */
import {
	Box,
	Flex,
	IconButton,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import React, { useCallback, useContext, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { ModalContext } from '../context/ModalContext';
import { Project, ProjectStatus } from '../models/Project';
import { useModifyProject } from '../mutations/useModifyProject';
import { ApiService } from '../services/ApiService';
import { devError } from '../utils/ConsoleUtils';
import { GetNextLexoRank } from '../utils/GetNextLexoRank';
import { LoadingSpinner } from './LoadingSpinner';
import { ProjectStatusTag, ProjectTimeStatus } from './ProjectTimeStatus';
import { DragDropIcon } from './icons/DragDropIcons';
import { VerticalDots } from './icons/VerticalDots';
import { ProjectToPropertyModal } from './modals/PropertyModals/ProjectToProperty';
import { useGetUserPrivileges } from '../hooks/useGetUserPrivileges';

interface SortableGridProps {
	list: Project[];
}

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
	background: isDraggingOver ? '#e7fff3' : 'transparent',
	display: 'flex',
	flexDirection: 'column',
	width: '100%'
});

export const NewProjectOverview: React.FC<SortableGridProps> = ({ list }) => {
	const [projects, setProjects] = useState<Project[]>(list);
	const { mutateAsync: mutateProject } = useModifyProject();

	const updateLexoRank = useCallback(
		async (project: Project, lexoRank: string) => {
			try {
				console.log(
					'Updating lexoRank for Project: ',
					project.projectId,
					' to: ',
					lexoRank
				);
				const rank = await mutateProject({
					projectId: project.projectId,
					name: project.name,
					description: project.description,
					startDate: project.startDate,
					endDate: project.endDate,
					status: project.status,
					progressStatus: project.progressStatus,
					lexoRank: lexoRank
				});
				console.log('Updated lexoRank: ', rank);
			} catch (e) {
				console.error(e);
				alert('Could not update project ordering, please try again');
			}
		},
		[mutateProject]
	);

	const onDragEnd = useCallback(
		(result) => {
			const { source, destination } = result;
			if (!destination || source.index === destination.index) {
				return;
			}

			const newProjects = Array.from(projects);
			const [reorderedItem] = newProjects.splice(source.index, 1);
			newProjects.splice(destination.index, 0, reorderedItem);

			const nextRank = GetNextLexoRank(newProjects, source.index, destination.index);
			reorderedItem.lexoRank = nextRank.toString();
			setProjects(newProjects);
			updateLexoRank(reorderedItem, nextRank.toString());
		},
		[projects, updateLexoRank]
	);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Flex direction="column" mt={1} overflowX="auto">
				<Flex
					flex="1"
					justifyContent={'space-between'}
					alignItems={'center'}
					bg="#F5F7FB"
					p={2}
				>
					<Box style={{ flexGrow: 1 }}>
						<Flex justifyContent={'space-between'} alignItems={'center'} flex="1">
							<Box flex="3" width="200px">
								<Text fontSize={'lg'} fontWeight={'semibold'}>
									Project name
								</Text>
							</Box>
							<Box flex="1" width={'75px'}>
								<Text fontSize={'lg'} fontWeight={'semibold'}>
									Due date
								</Text>
							</Box>
							<Box flex="1" width={'75px'}>
								<Text fontSize={'lg'} fontWeight={'semibold'}>
									Status
								</Text>
							</Box>
							{/* <Box flex="2" width={'100px'}>
								<Text fontSize={'lg'} fontWeight={'semibold'}>
									Property
								</Text>
							</Box> */}
						</Flex>
					</Box>
					<Box flex="0.5" width={'50px'}>
						<Text fontSize={'lg'} fontWeight={'semibold'}>
							Actions
						</Text>
					</Box>
				</Flex>
				<Droppable droppableId="project-list">
					{(provided, snapshot) => (
						<Flex
							ref={provided.innerRef}
							{...provided.droppableProps}
							style={getListStyle(snapshot.isDraggingOver)}
						>
							{projects.map((project, index) => (
								<Draggable
									key={project.projectId}
									draggableId={project.projectId.toString()}
									index={index}
								>
									{(provided, snapshot) => (
										<Flex
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											align="center"
											p={2}
											borderBottom="1px solid"
											borderColor="gray.200"
											bg={snapshot.isDragging ? 'gray.200' : 'white'}
										>
											{/* Conditionally display the DragDropIcon based on dragging state */}
											{snapshot.isDragging && (
												<Box pr={2}>
													<DragDropIcon />
												</Box>
											)}
											<NewProjectCard project={project} />
										</Flex>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</Flex>
					)}
				</Droppable>
			</Flex>
		</DragDropContext>
	);
};

const NewProjectCard = ({ project }) => {
	const [, setModalContext] = useContext(ModalContext);
	const queryClient = useQueryClient();
	const { mutateAsync: modify, isLoading, isError, error } = useModifyProject();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { privileges } = useGetUserPrivileges();
	const isViewer = privileges.includes('VIEWER');

	const updateStatus = async (status) => {
		try {
			const projectId = project?.projectId;
			if (projectId) {
				await modify({
					projectId,
					status
				});
				queryClient.refetchQueries(ApiService.projectList);
				queryClient.refetchQueries(ApiService.getProgressStatusList);
			}
		} catch (e) {
			devError('Error', e);
		}
	};

	return (
		<>
			<ProjectToPropertyModal
				isOpen={isOpen}
				onClose={onClose}
				projectId={project.projectId}
			/>

			<Flex flex="1" justifyContent="space-between" alignItems="center" p={1}>
				<Link
					to={`/project/${project.projectId}`}
					style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
				>
					<Flex justifyContent="space-between" alignItems="center" flex="1">
						<Box flex="3" width={'200px'}>
							<Text textColor="black">
								<Flex alignItems="center">{project.name}</Flex>
							</Text>
						</Box>
						<Box flex="1" width="75px">
							<Text>
								<ProjectTimeStatus project={project} />
							</Text>
						</Box>
						<Box flex="1" width="75px">
							<Text>
								<ProjectStatusTag project={project} />
							</Text>
						</Box>
						{/* <Box flex="2" width="100px">
						<Text>Property</Text>
					</Box> */}
					</Flex>
				</Link>
				<Box flex="0.5" width={'50px'}>
					<Text>
						{isError && <Text>{error?.errorText}</Text>}
						{isLoading ? (
							<Box py={1}>
								<LoadingSpinner size={32} />
							</Box>
						) : (
							<Menu>
								<MenuButton
									as={IconButton}
									variant="ghost"
									_hover={{ border: '1px', borderColor: 'gray.300' }}
									_active={{
										border: '1px',
										borderColor: 'gray.300',
										backgroundColor: 'transparent'
									}}
									icon={<VerticalDots />}
								/>
								<MenuList>
									<MenuItem
										onClick={(event) => {
											event.preventDefault();
											event.stopPropagation();
											setModalContext({ modifyProject: { project } });
										}}
										isDisabled={isViewer}
									>
										Edit Project
									</MenuItem>
									{project?.projectId && project.status === ProjectStatus.OPEN ? (
										<>
											{project?.owner && (
												<MenuItem
													onClick={async (event) => {
														event.preventDefault();
														event.stopPropagation();
														await updateStatus(ProjectStatus.CLOSED);
													}}
													isDisabled={isViewer}
												>
													Close this project
												</MenuItem>
											)}
										</>
									) : project?.projectId ? (
										<>
											{project?.owner && (
												<MenuItem
													onClick={async (event) => {
														event.preventDefault();
														await updateStatus(ProjectStatus.OPEN);
													}}
													isDisabled={isViewer}
												>
													Re-open this project
												</MenuItem>
											)}
										</>
									) : null}
									{project?.projectId &&
										project.status === ProjectStatus.CLOSED && (
											<MenuItem
												onClick={async (event) => {
													event.preventDefault();
													event.stopPropagation();
													await updateStatus(ProjectStatus.DONE);
												}}
												isDisabled={isViewer}
											>
												Archive project
											</MenuItem>
										)}
									<MenuDivider />
									<MenuItem onClick={onOpen} isDisabled={isViewer}>
										Add project to property
									</MenuItem>
								</MenuList>
							</Menu>
						)}
					</Text>
				</Box>
			</Flex>
		</>
	);
};
