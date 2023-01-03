import React from 'react';
import { Spacer } from '@chakra-ui/react';
// import { useProjectTenders } from '../../../queries/useProjectTenders';
import { ProcurementHeader } from './ProcurementHeader';
// import { ProcurementOffer } from './ProcurementOffer';
import { TenderTable } from './TenderTable';

const tenderItems = [
	{
		tenderId: 4,
		nr: 1234,
		description: '2x4 planks',
		volume: '30',
		unit: 'm3',
		price: 359
	},
	{
		tenderId: 4,
		nr: 35423,
		description: 'Reinforcing bars',
		volume: '45',
		unit: 'pieces',
		price: 678
	},
	{
		tenderId: 4,
		nr: 9834,
		description: 'Sand',
		volume: '30',
		unit: 'm3',
		price: 1209
	},
	{
		tenderId: 4,
		nr: 4564,
		description: 'Cement',
		volume: '230',
		unit: 'kg',
		price: 237
	},
	{
		tenderId: 4,
		nr: 6546,
		description: 'Nails',
		volume: '150',
		unit: 'pieces',
		price: 250
	}
];

// I'll want to fetch data from the API here,
// I have the endpoint for Tenders from each project.
// This data I can pass into the procurement Header and also to the table!

// in the table I could easily edit the data and send it back to the API.
// I'll need to figure out how I handle that.
// Maybe form?

export const Tender = (): JSX.Element => {
	// const testData = useProjectTenders(977);
	// test the endpoint with a known Id
	// console.log(testData)

	return (
		<div>
			<ProcurementHeader />
			<Spacer />
			<TenderTable tender={tenderItems} />
			<Spacer />
			{/* <ProcurementOffer /> */}
		</div>
	);
};
