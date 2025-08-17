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
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useContext, useEffect, useState } from 'react';
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
import { useRemoveUser } from '../queries/useRemoveUser';
import { useGetUserInfo } from '../queries/useGetUserInfo';
import { useGetUserByEmail } from '../queries/useGetUserByEmail';
import { ConfirmDialog } from './ConfirmDialog';
import { DataFetchingErrorBoundary } from './ErrorBoundary';

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
	const queryClient = useQueryClient();

	// Sync local state with incoming list prop
	useEffect(() => {
		const localIds = projects.map((p) => p.projectId).join(',');
		const propIds = list.map((p) => p.projectId).join(',');
		if (localIds !== propIds) {
			setProjects(list);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [list]);

	// Handler for drag end
	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) {
				return;
			}
			const oldIndex = projects.findIndex((p) => p.projectId.toString() === active.id);
			const newIndex = projects.findIndex((p) => p.projectId.toString() === over.id);
			if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
				return;
			}
			const nextRank = GetNextLexoRank(projects, oldIndex, newIndex);
			const newProjects = arrayMove(projects, oldIndex, newIndex);
			const reorderedItem = { ...newProjects[newIndex], lexoRank: nextRank.toString() };
			newProjects[newIndex] = reorderedItem;
			setProjects(newProjects); // Optimistic update
			// Async backend update
			mutateProject({
				projectId: reorderedItem.projectId,
				name: reorderedItem.name,
				description: reorderedItem.description,
				startDate: reorderedItem.startDate,
				endDate: reorderedItem.endDate,
				status: reorderedItem.status,
				progressStatus: reorderedItem.progressStatus,
				lexoRank: nextRank.toString()
			})
				.then(() => {
					queryClient.invalidateQueries({ queryKey: [ApiService.projectList] });
				})
				.catch((e) => {
					devError('Failed to update project lexoRank', e);
					// Optionally: refetch to revert optimistic update if needed
					queryClient.invalidateQueries({ queryKey: [ApiService.projectList] });
				});
		},
		[projects, mutateProject, queryClient]
	);

	return (
		<DndContext onDragEnd={onDragEnd} onDragStart={() => null}>
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
				<SortableContext items={projects.map((p) => p.projectId.toString())}>
					<Flex direction="column" style={getListStyle(false)}>
						{projects.map((project, index) => (
							<DraggableProjectItem
								key={project.projectId}
								project={project}
								index={index}
								extraStyle={{}}
							/>
						))}
					</Flex>
				</SortableContext>
			</Flex>
		</DndContext>
	);
};

interface DraggableProjectItemProps {
	project: Project;
	index: number;
	extraStyle?: React.CSSProperties;
}

const DraggableProjectItem = ({ project, index, extraStyle = {} }: DraggableProjectItemProps) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: project.projectId.toString(),
		data: { project, index }
	});

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		borderBottom: '1px solid',
		borderColor: 'gray.200',
		backgroundColor: isDragging ? 'gray.200' : 'white',
		display: 'flex',
		alignItems: 'center',
		padding: 'var(--chakra-space-2)',
		...extraStyle
	};

	return (
		<Flex ref={setNodeRef} style={style} align="center">
			<Box pr={2} cursor="grab" {...attributes} {...listeners}>
				<DragDropIcon />
			</Box>
			<NewProjectCard project={project} />
		</Flex>
	);
};

const NewProjectCard = ({ project }) => {
	const [, setModalContext] = useContext(ModalContext);
	const [dialogOpen, setDialogOpen] = useState(false);
	const queryClient = useQueryClient();
	const { mutateAsync: modify, isPending: isLoading, isError, error } = useModifyProject();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { privileges } = useGetUserPrivileges();
	const isViewer = privileges.includes('VIEWER');
	const { mutate: removeUser, isPending: isRemoveUserPending } = useRemoveUser();
	const { data } = useGetUserInfo();
	const userInfo = data;

	const searchMutation = useGetUserByEmail();

	const handleRemoveWorker = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({ email: userInfo.userName || '' });

			if (response.uId) {
				console.log('Found user to remove');
				removeUser({
					projectId: project.projectId,
					uId: response.uId
				});
				queryClient.invalidateQueries({ queryKey: [ApiService.projectList] });
			}
		} catch (e) {
			devError(e);
		}
	}, [searchMutation, userInfo, project.projectId, removeUser, queryClient]);

	const updateStatus = async (status) => {
		try {
			const projectId = project?.projectId;
			if (projectId) {
				await modify({
					projectId,
					status
				});
				queryClient.invalidateQueries({ queryKey: [ApiService.projectList] });
				queryClient.invalidateQueries({ queryKey: [ApiService.getProgressStatusList] });
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
					style={{
						textDecoration: 'none',
						color: 'inherit',
						flexGrow: 1
					}}
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
					</Flex>
				</Link>
				<Box flex="0.5" width={'50px'}>
					{isLoading || isRemoveUserPending ? (
						<Box py={1}>
							<LoadingSpinner size={32} />
						</Box>
					) : (
						<Menu>
							<MenuButton
								as={IconButton}
								variant="ghost"
								_active={{ bg: 'transparent' }}
								_hover={{ border: '1px', borderColor: 'gray.300' }}
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
								{project?.projectId && project.status === ProjectStatus.CLOSED && (
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
								<MenuDivider />
								{!project?.owner && (
									<ConfirmDialog
										header="Leave Project"
										setIsOpen={setDialogOpen}
										callback={async (b) => {
											if (b) {
												console.log('Remove');
												await handleRemoveWorker();
											}
											setDialogOpen(false);
										}}
										isOpen={dialogOpen}
										confirmButtonText={'Leave'}
									>
										<MenuItem onClick={() => setDialogOpen(true)}>
											Leave project
										</MenuItem>
									</ConfirmDialog>
								)}
							</MenuList>
						</Menu>
					)}
					{isError && <Text>{error?.errorText}</Text>}
				</Box>
			</Flex>
		</>
	);
};
