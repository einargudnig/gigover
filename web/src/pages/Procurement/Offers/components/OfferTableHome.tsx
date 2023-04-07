import React from 'react';
import { Button, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { TenderItem } from '../../../../models/Tender';

export const OfferTableHome = ({ tender }): JSX.Element => {
	// This is a component that is somewhat like a 'landing page' for the person making an offer.
	// The bidder will see this page, but he cannot interact with it. He has to open an offer to be able to interact with it.
	// or the bidder can go to his offers and update his offer.
	//! the reason for this is the offerIdContext was not working like I wanted it to. By doing it like this I can 'add' the offerId to the url and then use it in the OfferTable component.
	// hopefully this will also make it more stable.
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
						<Tooltip label="Click to edit the number, this could be a product number">
							<Th>Number</Th>
						</Tooltip>

						<Tooltip label="Description of the items">
							<Th>Description</Th>
						</Tooltip>

						<Tooltip label="Volume, how many items">
							<Th>Volume</Th>
						</Tooltip>

						<Tooltip label="The measurement of unit for items">
							<Th>Unit</Th>
						</Tooltip>

						<Tooltip label="Click to edit the cost for items">
							<Th>Cost</Th>
						</Tooltip>

						<Tooltip label="Click to add any notes/certifications for the items.">
							<Th>Notes/Certifications</Th>
						</Tooltip>
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

			<Text mt={'2'}>
				If you have already made an offer for this tender and you want to update it, you can
				see your offers by pressing this button.
			</Text>
			<Button mt={'2'}>
				<Link to={'/bidder-offers'}>Go to my Offers</Link>
			</Button>
		</>
	);
};
