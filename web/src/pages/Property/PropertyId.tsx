import React, { useContext, useState } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { Box, Button, Heading, Flex, Spacer } from '@chakra-ui/react';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { PropertyInfo } from './components/PropertyInfo';
import { Stakeholders } from './components/Stakeholders';
import { Units } from './components/Units';
import { Projects } from './components/Projects';
import { useGetPropertyById } from '../../queries/properties/useGetPropertyById';
import { useParams } from 'react-router-dom';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StakeholderModal } from '../../components/modals/PropertyModals/StakeholderModal';

export const PropertyId = (): JSX.Element => {
	const { propertyId } = useParams();
	const [, setModalContext] = useContext(ModalContext);
	const [manageStakeholders, setManageStakeholders] = useState(false);

	const { data, isLoading } = useGetPropertyById(Number(propertyId));
	const property = data?.property;
	// console.log('property', property);
	const units = data?.property.units;
	const stakeHolders = data?.property.stakeHolders;
	const projects = data?.property.projects;

	return (
		<>
			{manageStakeholders && units && (
				<StakeholderModal
					propertyId={Number(propertyId)}
					units={units}
					onClose={() => setManageStakeholders(false)}
				/>
			)}
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<PropertyInfo property={property} />

					<Box
						mb={1}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
						<Flex mb={8} alignItems={'center'}>
							<Box>
								<Heading mb={'4'} fontSize={'xl'}>
									Units
								</Heading>
							</Box>
							<Spacer />
							<Box>
								<Button
									leftIcon={<PlusIcon />}
									onClick={() =>
										setModalContext({
											addUnit: {
												unit: undefined,
												propertyId: Number(propertyId)
											}
										})
									}
								>
									Add unit
								</Button>
							</Box>
						</Flex>
						<Units units={units} propertyId={Number(propertyId)} />
					</Box>
					<Box
						mb={1}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
						<Flex mb={8} alignItems={'center'}>
							<Box>
								<Heading fontSize={'xl'}>Stakeholders</Heading>
							</Box>
							<Spacer />
							<Box>
								<Button
									leftIcon={<PlusIcon />}
									onClick={() => setManageStakeholders(true)}
								>
									Add stakeholders
								</Button>
							</Box>
						</Flex>
						{/* <Stakeholders stakeHolders={stakeHolders} /> */}
						{stakeHolders?.map((stakeholder) => (
							<Stakeholders
								stakeHolder={stakeholder}
								key={stakeholder.stakeHolderId}
							/>
						))}
					</Box>
					<Box
						mb={1}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
						<Box>
							<Heading fontSize={'xl'}>Projects</Heading>
						</Box>
						<Spacer />
						{projects?.map((project) => (
							<Projects project={project} key={project.projectId} />
						))}
						{/* <Projects projects={projects} /> */}
					</Box>
				</>
			)}
		</>
	);
};
