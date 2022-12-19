import React from 'react';
import { useProjectList } from '../../queries/useProjectList';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { Folder } from '../Files/components/Folder';
import { SimpleGrid } from '../../components/SimpleGrid';
import { VStack } from '@chakra-ui/react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ProcurementFolder } from './components/ProcurementFolder';

const projectsWithTenders = [
	{
		projectId: 1418,
		name: 'Another test project',
		description: 'This is an upcoming test project',
		finishDate: 1668038400000,
		owner: 'Einar',
		status: 'OPEN',
		tenders: [
			{
				projectId: 1418,
				taskId: 1852,
				tenderId: 1,
				name: 'Tender 1',
				description: 'This is a test tender',
				terms: 'This is a test tenderr description',
				finishDate: 1668038400000,
				delivery: 'Yes',
				address: 'dufnaholar 10',
				phoneNumber: '1234567'
			},
			{
				projectId: 1418,
				taskId: 1852,
				tenderId: 2,
				name: 'Tender 2',
				description: 'This is a second test tender',
				terms: 'This is a second test tender description',
				finishDate: 1668038400000,
				delivery: 'Yes',
				address: 'dufnaholar 11',
				phoneNumber: '1234567'
			},
			{
				projectId: 1418,
				taskId: 1852,
				tenderId: 3,
				name: 'Tender 3',
				description: 'This is a third test tender',
				terms: 'This is a third test tender description',
				finishDate: 1668038400000,
				delivery: 'Yes',
				address: 'dufnaholar 12',
				phoneNumber: '1234567'
			}
		]
	},
	{
		projectId: 1439,
		name: 'Another test project',
		description: 'More test',
		endDate: 1669420800000,
		owner: 'Jona',
		status: 'OPEN',
		tenders: [
			{
				projectId: 1439,
				taskId: 1852,
				tenderId: 4,
				name: 'Tender One',
				description: 'This is a new test tender',
				terms: 'This is a new test tender description',
				finishDate: 1668038400000,
				delivery: 'Yes',
				address: 'dufnaholar 12',
				phoneNumber: '1234567'
			},
			{
				projectId: 1439,
				taskId: 1852,
				tenderId: 5,
				name: 'Tender Two',
				description: 'This is a second test tender',
				terms: 'This is a second new test tender description',
				finishDate: 1668038400000,
				delivery: 'Yes',
				address: 'dufnaholar 12',
				phoneNumber: '1234567'
			}
		]
	}
];

export const ProcurementHome = () => {
	// ! I would like to have one query that returns all of our tenders,
	// but so it is tender based.
	// Returns all projects and their tenders.
	// const { data, isLoading } = useProjectList();
	// console.log({ data }, 'data');
	// const projects = useOpenProjects(data);
	// console.log({ projects }, 'projects');

	//! I can use this one when I start fetching all tenders?
	// if (isLoading) {
	// 	return <LoadingSpinner />;
	// }

	return (
		<div>
			<VStack alignItems={'flex-start'} style={{ width: '100%' }} spacing={4}>
				<SimpleGrid itemWidth={320}>
					{projectsWithTenders.map((t) => (
						<ProcurementFolder
							key={t.projectId}
							projectId={t.projectId}
							name={t.name}
							description={t.description}
							finishDate={t.finishDate}
							owner={t.owner}
							status={t.status}
							tenders={t.tenders}
						/>
					))}
				</SimpleGrid>
			</VStack>
		</div>
	);
};
