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
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModalContext } from '../context/ModalContext';
import { useGetUserPrivileges } from '../hooks/useGetUserPrivileges';
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
		(event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) {
				return;
			}

			const oldIndex = active.data.current?.index as number | undefined;
			const newIndex = over.data.current?.index as number | undefined;

			if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
				return;
			}

			const newProjects = Array.from(projects);
			const [reorderedItem] = newProjects.splice(oldIndex, 1);
			newProjects.splice(newIndex, 0, reorderedItem);

			const nextRank = GetNextLexoRank(newProjects, oldIndex, newIndex);
			reorderedItem.lexoRank = nextRank.toString();
			setProjects(newProjects);
			updateLexoRank(reorderedItem, nextRank.toString());
		},
		[projects, updateLexoRank]
	);

	const { setNodeRef: droppableSetNodeRef, isOver: droppableIsOver } = useDroppable({
		id: 'project-list-droppable'
	});

	return (
		<DndContext onDragEnd={onDragEnd}>
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
				<Flex ref={droppableSetNodeRef} style={getListStyle(droppableIsOver)}>
					{projects.map((project, index) => (
						<DraggableProjectItem
							key={project.projectId}
							project={project}
							index={index}
						/>
					))}
					{/* Placeholder equivalent might not be needed or can be handled differently with dnd-kit */}
				</Flex>
			</Flex>
		</DndContext>
	);
};

interface DraggableProjectItemProps {
	project: Project;
	index: number;
}

const DraggableProjectItem = ({ project, index }: DraggableProjectItemProps) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: project.projectId.toString(),
		data: { project, index } // Pass project and index data
	});

	const style: React.CSSProperties = {
		transform: CSS.Translate.toString(transform),
		transition: isDragging ? 'transform 0.2s ease' : undefined, // Apply transition during drag
		borderBottom: '1px solid',
		borderColor: 'gray.200',
		backgroundColor: isDragging ? 'gray.200' : 'white',
		display: 'flex',
		alignItems: 'center',
		padding: 'var(--chakra-space-2)' // Chakra p={2}
	};

	return (
		<Flex
			ref={setNodeRef}
			style={style}
			{...attributes} // Attributes on the main draggable Flex container
			align="center"
		>
			<Box pr={2} cursor="grab" {...listeners}>
				{' '}
				{/* Listeners applied to the handle */}
				<DragDropIcon />
			</Box>
			<NewProjectCard project={project} />
		</Flex>
	);
};

const NewProjectCard = ({ project }) => {
	const [, setModalContext] = useContext(ModalContext);
	const queryClient = useQueryClient();
	const { mutateAsync: modify, isPending: isLoading, isError, error } = useModifyProject();
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
				queryClient.refetchQueries({ queryKey: [ApiService.projectList] });
				queryClient.refetchQueries({ queryKey: [ApiService.getProgressStatusList] });
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
