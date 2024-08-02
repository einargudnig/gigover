/* eslint-disable no-shadow */
import { Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import React, { useCallback, useContext, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ModalContext } from '../context/ModalContext';
import { Project, ProjectStatus, ProjectStatusType } from '../models/Project';
import { useModifyProject } from '../mutations/useModifyProject';
import { devError } from '../utils/ConsoleUtils';
import { GetNextLexoRank } from '../utils/GetNextLexoRank';
import { ProjectStatusTag, ProjectTimeStatus } from './ProjectTimeStatus';
import { VerticalDots } from './icons/VerticalDots';

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
	console.log({ list });
	const mutateProject = useModifyProject();

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
			// updateLexoRank(reorderedItem, nextRank.toString());
		},
		[projects]
	);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Flex direction="column" mt={1} overflowX="auto">
				<Flex bg="#F5F7FB" p={2}>
					<Text fontSize={'lg'} fontWeight={'semibold'} flex="3">
						Project name
					</Text>
					<Text fontSize={'lg'} fontWeight={'semibold'} flex="1">
						Due date
					</Text>
					<Text fontSize={'lg'} fontWeight={'semibold'} flex="1">
						Status
					</Text>
					<Text fontSize={'lg'} fontWeight={'semibold'} flex="2">
						Property
					</Text>
					<Text fontSize={'lg'} fontWeight={'semibold'} flex="0.5"></Text>
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
									{(provided) => (
										<Flex
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											align="center"
											p={2}
											borderBottom="1px solid"
											borderColor="gray.200"
											bg="white"
										>
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

const NewProjectCard = ({ project }: { project: Project }) => {
	const [, setModalContext] = useContext(ModalContext);

	const { mutateAsync: modify, isLoading, isError, error } = useModifyProject();

	const updateStatus = async (status: string) => {
		try {
			const projectId = project?.projectId;

			if (projectId) {
				await modify({
					projectId,
					status: status as ProjectStatusType
				});
			}
		} catch (e) {
			devError('Error', e);
		}
	};

	return (
		<Flex flex="1" justifyContent="space-between" alignItems={'center'} p={1}>
			<Text textColor={'black'} flex="3">
				{project.name}
			</Text>
			{/* <Text flex="1">{project.endDate}</Text> */}
			<Text flex="1">
				<ProjectTimeStatus project={project} />
			</Text>
			<Text flex="1">
				<ProjectStatusTag project={project} />
			</Text>
			<Text flex="2">Property</Text>
			<Text flex="0.5">
				<Menu>
					<MenuButton
						as={IconButton}
						variant={'ghost'}
						_active={{ backgroundColor: 'transparent' }}
					>
						<VerticalDots />
					</MenuButton>
					<MenuList>
						<MenuItem
							onClick={(event) => {
								event.preventDefault();
								setModalContext({ modifyProject: { project } });
							}}
						>
							Edit Project
						</MenuItem>
						{project?.projectId && project.status === ProjectStatus.OPEN ? (
							<>
								{project.owner && (
									<MenuItem
										onClick={async (event) => {
											event.preventDefault();
											await updateStatus(ProjectStatus.CLOSED);
										}}
									>
										Close this project
									</MenuItem>
								)}
							</>
						) : project?.projectId ? (
							<MenuItem
								onClick={async (event) => {
									event.preventDefault();
									await updateStatus(ProjectStatus.OPEN);
								}}
							>
								Re-open this project
							</MenuItem>
						) : null}
						<MenuItem>Delete Project</MenuItem>
					</MenuList>
				</Menu>
			</Text>
		</Flex>
	);
};
