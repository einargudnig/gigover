import React from 'react';
import { Heading, HStack, VStack, Text } from '@chakra-ui/react';
import { CardBase } from '../../../components/CardBase';

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
	// I suspect I could do this similar to the way it is handled in the filesUI
	// I could have a state for selectedTender. When I have a selectedTender
	// I will show the Tender Modal, note that this would most likley have to be
	// a different modal from the one I have where I "start" the tender.
	return (
		<>
			<HStack spacing={4}>
				<Heading as={'h4'} size={'md'}>
					TENDERS FOR PROJECT!
				</Heading>
			</HStack>
			<VStack justify={'space-between'} align={'center'} mb={4} style={{ width: '100%' }}>
				{tenders.map((tender) => (
					<CardBase key={tender.tenderId}>
						<VStack align={'stretch'} spacing={4}>
							<HStack justify={'space-between'} align={'center'}>
								<VStack>
									<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
										{tender.name}
									</Heading>
									<Text>{tender.description}</Text>
								</VStack>
							</HStack>
						</VStack>
					</CardBase>
				))}
			</VStack>
		</>
	);
};
