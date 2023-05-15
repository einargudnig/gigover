import React from 'react';
import { Button, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { TenderItem } from '../../../../models/Tender';

export const OfferTableHome = ({ tender }): JSX.Element => {
	// This is a component that is somewhat like a 'landing page' for the person making an offer.
	// The bidder will see this page, but he cannot interact with it. He has to open an offer to be able to interact with it.
	// or the bidder can go to his offers and update his offer.
	const tenderItems: TenderItem[] | undefined = tender?.items;

	return (
		<>
			<Text my={'2'}>
				This is the tender you have been invited to make an offer to. You have to open an
				offer to be able to add you product numbers, costs and notes.
			</Text>
			<Table>
				<Thead>
					<Tr>
						<Th>Number</Th>
						<Th>Description</Th>
						<Th>Volume</Th>
						<Th>Unit</Th>
						<Th>Cost</Th>
						<Th>Notes/Certifications</Th>
					</Tr>
				</Thead>
				<Tbody>
					{tenderItems?.map((row) => (
						<Tr key={row.tenderItemId}>
							<Td>no number</Td>
							<Td>{row.description}</Td>
							<Td>{row.volume}</Td>
							<Td>{row.unit}</Td>
							<Td>no cost</Td>
							<Td>no notes</Td>
						</Tr>
					))}
				</Tbody>
			</Table>

			<Text mt={'2'}>You can see the offers you have already made</Text>
			<Button mt={'2'}>
				<Link to={'/bidder-offers'}>Go to my Offers</Link>
			</Button>
		</>
	);
};
