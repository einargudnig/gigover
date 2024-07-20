import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
	Text,
	VStack,
	useDisclosure,
	useEventListener
} from '@chakra-ui/react';
import { FC, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { Project } from '../../models/Project';
import { ProjectFormData, useModifyProject } from '../../mutations/useModifyProject';
import { useProgressStatusList } from '../../queries/useProgressStatusList';
import { useProjectList } from '../../queries/useProjectList';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';
import { GetNextLexoRank } from '../../utils/GetNextLexoRank';
import { DatePicker } from '../forms/DatePicker';

export interface ProjectModalProps {
	project?: Project;
	open: boolean;
	onClose: () => void;
	title: string;
}

export const NewProjectModal: FC<ProjectModalProps> = ({
	project,
	open: drawerOpen,
	onClose,
	title
}) => {
	const { isOpen, onClose: drawerClose } = useDisclosure({ isOpen: drawerOpen });
	const queryClient = useQueryClient();
	const { data: progressStatuses } = useProgressStatusList();

	const { data: projects } = useProjectList();
	const [progressStatus, setProgressStatus] = useState(
		project?.progressStatus
			? {
					name: project?.progressStatus,
					id: -1
			  }
			: undefined
	);
	const { mutateAsync: modify, isLoading: projectLoading, isError, error } = useModifyProject();
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

	useEventListener('keydown', (event) => {
		if (event.keyCode === 27) {
			closeDrawer();
		}
	});

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

			queryClient.refetchQueries(ApiService.projectList);
			queryClient.refetchQueries(ApiService.getProgressStatusList);
			closeDrawer();
		} catch (e) {
			devError('Error', e);
		}
	});

	return (
		<Drawer isOpen={isOpen} onClose={drawerClose} size="lg">
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton onClick={() => closeDrawer()} />
				<DrawerHeader>{title}</DrawerHeader>
				<DrawerBody>
					<form onSubmit={onSubmit} id="updateProject">
						<VStack mb={-6} align={'stretch'}>
							<FormControl id={'name'} isInvalid={!!errors.name}>
								<FormLabel>Project name</FormLabel>
								<Input
									{...register('name', {
										required: 'Please add a project name'
									})}
								/>
								{errors.name && <Text color="red.500">{errors.name.message}</Text>}
							</FormControl>
							<Box mb={6} />
							<FormControl id={'description'} isInvalid={!!errors.description}>
								<FormLabel>Project description</FormLabel>
								<Input
									{...register('description', {
										required: 'Please add project description'
									})}
								/>
								{errors.description && (
									<Text color="red.500">{errors.description.message}</Text>
								)}
							</FormControl>
							<Box mb={6} />
							<FormControl id={'progressStatus'} isInvalid={!!errors.progressStatus}>
								<FormLabel>Status</FormLabel>
								{/* <Controller
									name="progressStatus"
									control={control}
									render={({ field: { onChange, value , onBlur } }) => (
										<Select
											value={value}
											onChange={onChange}
											onBlur={onBlur}
											required={true}
										>
											{progressStatuses?.progressStatusList.map((ps) => (
												<option key={ps.id} value={ps.name}>
													{ps.name}
												</option>
											))}
										</Select>
									)}
								/> */}
								<Select
									{...register('progressStatus', {
										required: 'Progress status is required'
									})}
								>
									{progressStatuses?.progressStatusList.map((ps) => (
										<option key={ps.id} value={ps.name}>
											{ps.name}
										</option>
									))}
								</Select>
								{errors.progressStatus && (
									<Text color="red.500">{errors.progressStatus.message}</Text>
								)}
							</FormControl>
							<Box mb={6} />
							{/* <FormControl id={'property'} isInvalid={!!errors.property}>
								<FormLabel>Property</FormLabel>
								<Select required={true} {...register('property', {})}>
									 {progressStatuses?.map((ps) => (
										<option key={ps.id} value={ps.name}>
											{ps.name}
										</option>
									))}
								</Select>
								{errors.property && (
									<Text color="red.500">{errors.property.message}</Text>
								)}
							</FormControl> */}
							<Box mb={6} />
							<FormControl>
								<FormLabel htmlFor="startDate">Start and end date</FormLabel>
								<HStack>
									<Controller
										name="startDate"
										control={control}
										defaultValue={
											project?.startDate
												? (project.startDate.valueOf() as number)
												: undefined
										}
										render={({ field: { onChange, value, onBlur } }) => (
											<DatePicker
												selected={value ? new Date(value) : null}
												onChange={(date) => {
													if (date) {
														onChange((date as Date).getTime());
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
										render={({ field: { onChange, value, onBlur } }) => (
											<DatePicker
												selected={value ? new Date(value) : null}
												onChange={(date) => {
													if (date) {
														onChange((date as Date).getTime());
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
									<Text textColor={'red.500'}>{errors.startDate?.message}</Text>
								)}
								{errors.endDate && (
									<Text textColor={'red.500'}>{errors.endDate?.message}</Text>
								)}
							</FormControl>
						</VStack>
					</form>
				</DrawerBody>
				<DrawerFooter mb={12}>
					<Button
						colorScheme="gray"
						type="submit"
						form="updateProject"
						isLoading={projectLoading}
					>
						Save
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
