import { Box, Button, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StakeholderModal } from '../../components/modals/PropertyModals/StakeholderModal';
import { ModalContext } from '../../context/ModalContext';
import { useGetPropertyById } from '../../queries/properties/useGetPropertyById';
import { Projects } from './components/Projects';
import { PropertyFiles } from './components/PropertyFiles';
import { PropertyInfo } from './components/PropertyInfo';
import { Stakeholders } from './components/Stakeholders';
import { Units } from './components/Units';

export const PropertyId = (): JSX.Element => {
	const { propertyId } = useParams();
	const [, setModalContext] = useContext(ModalContext);
	const [manageStakeholders, setManageStakeholders] = useState(false);

	const { data, isLoading } = useGetPropertyById(Number(propertyId));
	const property = data?.property;
	const units = data?.property.units;
	const stakeHolders = data?.property.stakeHolders;
	const projects = data?.property.projects;
	const documents = data?.property.documents;

	return (
		<>
			{manageStakeholders && units && (
				<StakeholderModal
					propertyId={Number(propertyId)}
					propertyName={property?.name}
					units={units}
					onClose={() => setManageStakeholders(false)}
				/>
			)}
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<Box bg={'#F5F7FB'}>
					<PropertyInfo property={property} />

					<Box
						mb={3}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'white'}
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
									variant="outline"
									colorScheme="black"
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
						{!units || units.length === 0 ? (
							<Text m={4}>No units!</Text>
						) : (
							units?.map((unit) => (
								<Units
									unit={unit}
									propertyId={Number(propertyId)}
									key={unit.unitId}
								/>
							))
						)}
					</Box>
					<Box
						mb={3}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'white'}
						w="100%"
					>
						<Flex mb={8} alignItems={'center'}>
							<Box>
								<Heading fontSize={'xl'}>Stakeholders</Heading>
							</Box>
							<Spacer />
							<Box>
								<Button
									variant="outline"
									colorScheme="black"
									onClick={() => setManageStakeholders(true)}
								>
									Add stakeholders
								</Button>
							</Box>
						</Flex>
						{!stakeHolders || stakeHolders.length === 0 ? (
							<Text m={4}>No stakeholders!</Text>
						) : (
							stakeHolders?.map((stakeholder) => (
								<Stakeholders
									stakeHolder={stakeholder}
									key={stakeholder.stakeHolderId}
								/>
							))
						)}
					</Box>
					<Box
						mb={3}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'white'}
						w="100%"
					>
						<Box>
							<Heading fontSize={'xl'}>Projects</Heading>
						</Box>
						<Spacer />
						{!projects || projects.length === 0 ? (
							<Text m={4}>No projects!</Text>
						) : (
							projects?.map((project) => (
								<Projects project={project} key={project.projectId} />
							))
						)}
					</Box>
					<Box
						mb={3}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'white'}
						w="100%"
					>
						<Box>
							<Heading fontSize={'xl'}>Documents</Heading>
						</Box>
						<Spacer />
						{!documents || documents.length === 0 ? (
							<Text m={4}>No projects!</Text>
						) : (
							documents
								?.sort((a, b) =>
									b.created && a.created ? b.created - a.created : -1
								)
								.map((document, pIndex) => (
									<Box key={pIndex} p={1} m={1}>
										<PropertyFiles showDelete={true} file={document} />
									</Box>
								))
						)}
					</Box>
				</Box>
			)}
		</>
	);
};
