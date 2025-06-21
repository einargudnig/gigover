import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StakeholderModal } from '../../components/modals/PropertyModals/StakeholderModal';
import { useGetPropertyById } from '../../queries/properties/useGetPropertyById';
import { PropertyLayout } from './PropertyLayout';
import { DocumentsTab } from './components/DocumentsTab';
import { ProjectsTab } from './components/ProjectsTab';
import { PropertyInfo } from './components/PropertyInfo';
import { StakeholdersTab } from './components/StakeholdersTab';
import { UnitTab } from './components/UnitsTab';

export const PropertyId = (): JSX.Element => {
	const { propertyId } = useParams();
	const [manageStakeholders, setManageStakeholders] = useState(false);

	const { data, isPending: isLoading, isFetching } = useGetPropertyById(Number(propertyId));
	const property = data?.property;
	const units = data?.property.units;
	const stakeHolders = data?.property.stakeHolders;
	const projects = data?.property.projects;
	const documents = data?.property.documents;

	return (
		<PropertyLayout>
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

					<Tabs isFitted size="lg" align="center" colorScheme="blackAlpha">
						<TabList>
							<Tab>Units</Tab>
							<Tab>Stakeholders</Tab>
							<Tab>Projects</Tab>
							<Tab>Documents</Tab>
						</TabList>

						<TabPanels>
							<TabPanel>
								<UnitTab
									propertyId={Number(propertyId)}
									units={units!}
									isFetching={isFetching}
								/>
							</TabPanel>
							<TabPanel>
								<StakeholdersTab
									stakeHolders={stakeHolders!}
									setManageStakeholders={setManageStakeholders}
									units={units!}
									isFetching={isFetching}
								/>
							</TabPanel>
							<TabPanel>
								<ProjectsTab projects={projects!} isFetching={isFetching} />
							</TabPanel>
							<TabPanel>
								<DocumentsTab
									propertyId={Number(propertyId)}
									documents={documents!}
									isFetching={isFetching}
								/>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
			)}
		</PropertyLayout>
	);
};
