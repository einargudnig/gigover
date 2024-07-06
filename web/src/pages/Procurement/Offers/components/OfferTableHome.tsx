import { Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { TenderItem } from '../../../../models/Tender';

export const OfferTableHome = ({ tender }): JSX.Element => {
	// This is a component that is somewhat like a 'landing page' for the person making an offer.
	// The bidder will see this page, but he cannot interact with it. He has to open an offer to be able to interact with it.
	// or the bidder can go to his offers and update his offer.
	const tenderItems: TenderItem[] | undefined = tender?.items;

	return (
		<>
			<Text my={'2'} fontSize={'lg'}>
				This is the tender you have been invited to make an offer to. You have to open an
				offer to be able to add <strong>product numbers</strong>, <strong>costs</strong> and{' '}
				<strong>notes</strong>.
			</Text>
			<Table>
				<Thead>
					<Tr>
						<Th>Number</Th>
						<Th>Description</Th>
						<Th>Volume</Th>
						<Th>Unit</Th>
					</Tr>
				</Thead>
				<Tbody>
					{tenderItems?.map((row) => (
						<Tr key={row.tenderItemId}>
							<Td>{row.nr}</Td>
							<Td>{row.description}</Td>
							<Td>{row.volume}</Td>
							<Td>{row.unit}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</>
	);
};
