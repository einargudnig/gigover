import React, { useState } from 'react';
import { Tender } from '../../models/Tender';
import { Box, Heading, Text, VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import styled from 'styled-components';
import { Modal } from '../Modal';
import { FormActions } from '../FormActions';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { TrackerSelect } from '../TrackerSelect';
import { useProjectList } from '../../queries/useProjectList';
import { useCloseModal } from '../../hooks/useCloseModal';
// import { useQueryClient } from 'react-query';
import { DatePicker } from '../forms/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { useAddTender, TenderFormData } from '../../mutations/useAddTender';
// import { useProjectFolders } from '../../mutations/useProjectFolders';

interface TenderModalProps {
	tender?: Tender;
}

// interface TenderModal {
// 	onClose: () => void;
// 	onComplete: (status: boolean) => void;
// 	projectId?: number;
// }

const ProcurementModalStyled = styled.div`
	@media screen and (max-width: 500px) {
		width: 500px;
	}
`;

export const ProcurementModal = ({ tender }: TenderModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const { data } = useProjectList();
	// const { mutateAsync, data: projectFolders } = useProjectFolders();
	const openProjects = useOpenProjects(data);

	// const [selectedProject, setSelectedProject] = useState<number | undefined>(projectId);
	const { register, handleSubmit, errors, reset, control } = useForm<TenderFormData>({
		// defaultValues: {
		// 	projectId = 977,
		// 	taskId = 2,
		// 	description = 'testing',
		// 	terms = 'has to arrive by noon',
		// 	finishDate = 167189508,
		// 	delivery = '1',
		// 	address = 'dufnaholar 10',
		// 	phoneNumber = '1234567'
		// },
		defaultValues: tender,
		mode: 'onBlur'
	});

	return (
		<div>
			{/* {} */}
			<Modal open={true} onClose={closeModal} title={'New Procurement'}>
				<ProcurementModalStyled>
					<VStack mb={-6} align={'stretch'}>
						{openProjects ? (
							<>
								<Heading size={'md'}>Select a project for your procurement</Heading>
								<TrackerSelect
									title={'Select a project'}
									// value={selectedProject}
									options={openProjects.map((project) => ({
										label: project.name,
										value: project.projectId
									}))}
									valueChanged={(newValue) => {
										if (newValue === '') {
											// setSelectedProject(undefined);
										} else {
											// setSelectedProject((newValue as number) ?? undefined);
										}
									}}
								/>
							</>
						) : (
							<>
								<Heading>No projects</Heading>
								<Text>
									You do not have any projects, you have to create a project
									before you can make a procurement
								</Text>
							</>
						)}
						{/* Task
						   We want to be able to find aldready open tasks
							 to connect to the tender!
						*/}
						<form>
							<FormControl id={'name'} isRequired>
								<FormLabel>Procurement name</FormLabel>
								<Input
									name="name"
									required={true}
									ref={register({ required: 'Procurement name is required' })}
								/>
							</FormControl>
							<Box mb={6} />
							<FormControl>
								<FormLabel>Procurement Description</FormLabel>
								<Input
									name="description"
									required={true}
									ref={register({
										required: 'Procurement description is required'
									})}
								/>
							</FormControl>
							<Box mb={6} />
							<FormControl>
								<FormLabel>Terms</FormLabel>
								<Input
									name="terms"
									required={true}
									ref={register({ required: 'terms are required' })}
								/>
							</FormControl>
							<Box mb={6} />
							<FormControl>
								<FormLabel>Finish Date</FormLabel>
								<Controller
									name="endDate"
									control={control}
									// defaultValue={
									// 	project?.endDate ? new Date(project.endDate) : null
									// }
									render={({ onChange, value, onBlur }) => (
										<DatePicker
											selected={value}
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
							</FormControl>
							<Box mb={6} />
							<FormControl>
								<FormLabel>Delivery</FormLabel>
								<Input
									name="delivery"
									required={true}
									ref={register({ required: 'delivery is required' })}
								/>
							</FormControl>
							<Box mb={6} />
							<FormControl>
								<FormLabel>Address</FormLabel>
								<Input
									name="address"
									required={true}
									ref={register({ required: 'address is required' })}
								/>
							</FormControl>
							<Box mb={6} />
							<FormControl>
								<FormLabel>Phone Number</FormLabel>
								<Input
									name="phoneNumber"
									required={true}
									ref={register({ required: 'phone number is required' })}
								/>
							</FormControl>
						</form>
						<FormActions
							cancelText={'Close'}
							onCancel={() => closeModal()}
							submitText={'Create'}
						/>
					</VStack>
				</ProcurementModalStyled>
			</Modal>
		</div>
	);
};
