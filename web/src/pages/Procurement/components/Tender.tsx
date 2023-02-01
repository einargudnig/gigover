import React from 'react';
import { Spacer } from '@chakra-ui/react';
// import { useProjectTenders } from '../../../queries/useProjectTenders';
import { ProcurementHeader } from './ProcurementHeader';
// import { ProcurementOffer } from './ProcurementOffer';
import { TenderTable } from './TenderTable';
import { NewTable } from './NewTable';

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

//? I think this page is just a layout, I will fetch the data and do more stuff in the components.
export const Tender = (): JSX.Element => {
	// const testData = useProjectTenders(977);
	// test the endpoint with a known Id
	// console.log(testData)

	return (
		<div>
			<ProcurementHeader />
			<Spacer />
			{/* <TenderTable /> */}
			<NewTable />
			<Spacer />
			{/* <ProcurementOffer /> */}
		</div>
	);
};
