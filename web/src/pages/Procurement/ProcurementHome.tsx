import React from 'react';
import { SimpleGrid } from '../../components/SimpleGrid';
import { Center, VStack } from '@chakra-ui/react';
import { ProcurementFolder } from './components/ProcurementFolder';
import { useUserTenders } from '../../queries/useUserTenders';
import { useProjectList } from '../../queries/useProjectList';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ProcurementHome = () => {
	const { data, isLoading } = useUserTenders();
	const { data: projects } = useProjectList(); // Just to get the projectName :/

	// Get the projectNames from projects and add them to the tenders
	const projectsWithTenders = data.map((t) => {
		const projectName = projects.find((p) => p.projectId === t.projectId);
		return { ...t, projectName };
	});
	console.log('HERE', projectsWithTenders);

	// I'm going to change the structure of this a little bit!
	// instead of showing one folder for each prroject i'm going to show a list of the tenders.
	// By clicking an item I will go and see the tenderItems.
	// I will keep the other structure commented out so i nthe future i could re-use it.

	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<div>
					<VStack alignItems={'flex-start'} style={{ width: '100%' }} spacing={4}>
						<SimpleGrid itemWidth={320}>
							{
								// Map through the projectNames and make a ProcurementFolder for each projectid
								projectsWithTenders.map((p) => {
									return (
										<ProcurementFolder
											key={p.projectId}
											projectId={p.projectId}
											name={p?.projectName?.name}
										/>
									);
								})
							}
						</SimpleGrid>
					</VStack>
				</div>
			)}
		</>
	);
};
