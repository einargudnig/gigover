import React from 'react';
import { useParams } from 'react-router-dom';
import { Heading, HStack, VStack, Text, Box } from '@chakra-ui/react';
import { CardBaseLink } from '../../../components/CardBase';
import { useQuery } from 'react-query';
import { ApiService } from '../../../services/ApiService';

const tenders = [
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
];

export const Tenders = (): JSX.Element => {
	const params = useParams();
	const projectId = params.projectId ? parseInt(params.projectId) : -1;
	// I suspect I could do this similar to the way it is handled in the filesUI
	// I could have a state for selectedTender. When I have a selectedTender
	// I will show the Tender Modal, note that this would most likley have to be
	// a different modal from the one I have where I "start" the tender.

	//! Here I could fetch the tenders for certain projects!
	// I have to use react-query but using the endpoint.
	// const response = useQuery(ApiService.projectTenders(projectId));
	// console.log(response.data, 'projectTenders');
	//! This is undefined
	// see useGetProjectTenders in useQueries
	return (
		<>
			<HStack spacing={4}>
				<Heading as={'h4'} size={'md'} mb={'6'}>
					TENDERS FOR
				</Heading>
			</HStack>
			<VStack justify={'space-between'} align={'center'} mb={4}>
				<Box w={'100%'}>
					{tenders.map((tender) => (
						<CardBaseLink to={`${tender.tenderId}`} key={tender.tenderId}>
							<VStack align={'center'}>
								<HStack justify={'space-between'} align={'center'}>
									<VStack align={'center'}>
										<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
											{tender.name}
										</Heading>
										<Text>{tender.description}</Text>
									</VStack>
								</HStack>
							</VStack>
						</CardBaseLink>
					))}
				</Box>
			</VStack>
		</>
	);
};
