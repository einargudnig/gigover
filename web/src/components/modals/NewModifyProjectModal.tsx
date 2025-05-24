import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Select,
	SkeletonCircle,
	SkeletonText,
	Spacer,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { FC, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Project } from '../../models/Project';
import { ProjectFormData, useModifyProject } from '../../mutations/useModifyProject';
import { useProgressStatusList } from '../../queries/useProgressStatusList';
import { useProjectList } from '../../queries/useProjectList';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';
import { GetNextLexoRank } from '../../utils/GetNextLexoRank';
import { DatePicker } from '../forms/DatePicker';
import { CrossIcon } from '../icons/CrossIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { VerticalDots } from '../icons/VerticalDots';

export interface ProjectModalProps {
	project?: Project;
	open: boolean;
	onClose: () => void;
}

export const NewModifyProjectModal: FC<ProjectModalProps> = ({
	project,
	open: drawerOpen,
	onClose
}) => {
	const { isOpen, onClose: drawerClose } = useDisclosure({ isOpen: drawerOpen });

	const queryClient = useQueryClient();
	const { data: progressStatuses } = useProgressStatusList();

	const { data: projects } = useProjectList();
	// const { data: properties } = useGetProperties();
	const [progressStatus] = useState(
		project?.progressStatus
			? {
					name: project?.progressStatus,
					id: -1
			  }
			: undefined
	);
	const {
		mutateAsync: modify,
		isPending: projectLoading,
		isError: isProjectError,
		error: projectError
	} = useModifyProject();
	const {
		register,
		handleSubmit,
		formState: { errors },
		control
	} = useForm<ProjectFormData>({
		defaultValues: {
			name: project?.name || '',
			description: project?.description || '',
			startDate: project?.startDate?.valueOf() || undefined,
			endDate: project?.endDate?.valueOf() || undefined,
			progressStatus: project?.progressStatus || ''
		},
		mode: 'onBlur'
	});

	const closeDrawer = useCallback(() => {
		if (onClose) {
			console.log('Closing drawer');
			onClose();
		}
	}, [onClose]);

	// useEventListener('keydown', (event) => {
	// 	if (event.keyCode === 27) {
	// 		closeDrawer();
	// 	}
	// });

	// Property stuff
	// const [selectedProperty] = useState<IProperties | undefined>();
	// const closeModal = useCloseModal();
	// const { mutateAsync: addProjectToProperty } = useAddProjectToProperty();

	const onSubmit = handleSubmit(async ({ name, description, startDate, endDate }) => {
		console.log({ name, description, startDate, endDate });
		try {
			await modify({
				projectId: project?.projectId,
				name,
				description,
				startDate,
				endDate,
				lexoRank: GetNextLexoRank(projects, -1, 0).toString(),
				status: project?.status || 'OPEN',
				progressStatus: progressStatus?.name ?? null
			});

			queryClient.refetchQueries({ queryKey: [ApiService.projectList] });
			queryClient.refetchQueries({ queryKey: [ApiService.getProgressStatusList] });
			closeDrawer();
		} catch (e) {
			devError('Error', e);
		}
	});

	// const addProject = () => {
	// 	console.log(
	// 		'add project',
	// 		'projectId:',
	// 		project?.projectId,
	// 		'propertyId',
	// 		selectedProperty?.propertyId
	// 	);
	// 	const data: PropertyToProject = {
	// 		projectId: project!.projectId,
	// 		propertyId: selectedProperty!.propertyId
	// 	};

	// 	addProjectToProperty(data);
	// 	// add a timeout to allow the mutation to complete
	// 	setTimeout(() => {
	// 		closeModal();
	// 	}, 1000);
	// };

	return (
		<Drawer isOpen={isOpen} onClose={drawerClose} size="lg">
			<DrawerOverlay />
			<DrawerContent maxHeight={'100vh'}>
				<Flex direction={'column'}>
					<Flex alignItems={'center'}>
						<Box>
							<DrawerHeader>Edit {project?.name}</DrawerHeader>
						</Box>
						<Spacer />
						<Box>
							<Flex alignItems={'center'} mr="4">
								<Menu>
									<MenuButton
										as={IconButton}
										aria-label="More"
										icon={<VerticalDots />}
										variant="ghost"
										_active={{ bg: 'gray.100' }}
									/>
									<MenuList>
										<MenuItem icon={<TrashIcon />}>Archive project</MenuItem>
									</MenuList>
								</Menu>
								<IconButton
									aria-label="Close"
									icon={<CrossIcon />}
									variant="ghost"
									onClick={onClose}
								/>
							</Flex>
						</Box>
					</Flex>

					<DrawerBody overflowY={'auto'}>
						<Tabs colorScheme="black">
							<TabList>
								<Tab>Details</Tab>
								<Tab>Properties</Tab>
								<Tab>Resources</Tab>
							</TabList>

							<TabPanels>
								<TabPanel>
									{isProjectError && (
										<Text color="red.500">{projectError?.errorText}</Text>
									)}
									{projectLoading ? (
										<>
											<Box marginTop={4}>
												<SkeletonCircle size="8" />
												<SkeletonText mt="4" noOfLines={12} spacing="6" />
											</Box>
										</>
									) : (
										<>
											<form onSubmit={onSubmit} id="updateProject">
												<VStack mb={-6} align={'stretch'}>
													<FormControl
														id={'name'}
														isInvalid={!!errors.name}
													>
														<FormLabel>Project name</FormLabel>
														<Input
															{...register('name', {
																required:
																	'Please add a project name'
															})}
														/>
														{errors.name && (
															<Text color="red.500">
																{errors.name.message}
															</Text>
														)}
													</FormControl>
													<Box mb={6} />
													<FormControl
														id={'description'}
														isInvalid={!!errors.description}
													>
														<FormLabel>Project description</FormLabel>
														<Input
															{...register('description', {
																required:
																	'Please add project description'
															})}
														/>
														{errors.description && (
															<Text color="red.500">
																{errors.description.message}
															</Text>
														)}
													</FormControl>
													<Box mb={6} />
													<FormControl
														id={'progressStatus'}
														isInvalid={!!errors.progressStatus}
													>
														<FormLabel>Status</FormLabel>
														<Select
															{...register('progressStatus', {
																required:
																	'Progress status is required'
															})}
														>
															{progressStatuses?.progressStatusList.map(
																(ps) => (
																	<option
																		key={ps.id}
																		value={ps.name}
																	>
																		{ps.name}
																	</option>
																)
															)}
														</Select>
														{errors.progressStatus && (
															<Text color="red.500">
																{errors.progressStatus.message}
															</Text>
														)}
													</FormControl>
													<Box mb={6} />

													<FormControl>
														<FormLabel htmlFor="startDate">
															Start and end date
														</FormLabel>
														<HStack>
															<Controller
																name="startDate"
																control={control}
																defaultValue={
																	project?.startDate
																		? (project.startDate.valueOf() as number)
																		: undefined
																}
																render={({
																	field: {
																		onChange,
																		value,
																		onBlur
																	}
																}) => (
																	<DatePicker
																		selected={
																			value
																				? new Date(value)
																				: null
																		}
																		onChange={(date) => {
																			if (date) {
																				onChange(
																					(
																						date as Date
																					).getTime()
																				);
																			} else {
																				onChange(null);
																			}
																		}}
																		onBlur={onBlur}
																		required={false}
																	/>
																)}
															/>
															<Controller
																name="endDate"
																control={control}
																defaultValue={
																	project?.endDate
																		? (project.endDate.valueOf() as number)
																		: undefined
																}
																render={({
																	field: {
																		onChange,
																		value,
																		onBlur
																	}
																}) => (
																	<DatePicker
																		selected={
																			value
																				? new Date(value)
																				: null
																		}
																		onChange={(date) => {
																			if (date) {
																				onChange(
																					(
																						date as Date
																					).getTime()
																				);
																			} else {
																				onChange(null);
																			}
																		}}
																		onBlur={onBlur}
																	/>
																)}
															/>
														</HStack>
														{errors.startDate && (
															<Text textColor={'red.500'}>
																{errors.startDate?.message}
															</Text>
														)}
														{errors.endDate && (
															<Text textColor={'red.500'}>
																{errors.endDate?.message}
															</Text>
														)}
													</FormControl>
												</VStack>
											</form>
											<DrawerFooter mt={6}>
												<Button
													colorScheme="gray"
													type="submit"
													form="updateProject"
													isLoading={projectLoading}
												>
													Save
												</Button>
											</DrawerFooter>
										</>
									)}
								</TabPanel>
								<TabPanel>
									<p>two!</p>
								</TabPanel>
								<TabPanel>
									<p>three!</p>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</DrawerBody>
				</Flex>
			</DrawerContent>
		</Drawer>
	);
};
