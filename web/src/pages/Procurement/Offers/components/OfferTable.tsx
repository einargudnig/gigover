import React, { useState } from 'react';
import { Tender, TenderItem } from '../../../../models/Tender';
import { useTenderById } from '../../../../queries/useGetTenderById';
import { useParams } from 'react-router-dom';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';
import {
	Button,
	Box,
	Flex,
	HStack,
	Input,
	Table,
	Text,
	Tbody,
	Td,
	Thead,
	Th,
	Tr,
	Tooltip
} from '@chakra-ui/react';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';
import { usePublishOffer } from '../../../../mutations/usePublishOffer';

export const OfferTable = (): JSX.Element => {
	const { tenderId } = useParams(); //! Cast to NUMBER(tenderId)
	// GET user tenders from database
	const {
		data
		// isLoading: isTenderLoading,
		// isError: isTenderError,
		// error: tenderError
	} = useTenderById(Number(tenderId));
	//! This will cause me annoying trouble that I have to deal with
	// Fx, when I want to modify or delete items they can be undefined, which is no bueno.
	// There is a way around this, but it's not pretty.
	const tender: Tender | undefined = data?.tender;
	const tenderItems: TenderItem[] | undefined = tender?.items;

	const [cost, setCost] = useState<number | undefined>(0);
	const [notes, setNotes] = useState<string | undefined>('');
	const [buttonText, setButtonText] = useState('Add to Table');
	const [selectedRow, setSelectedRow] = useState(-1);

	// Add offers to items
	const { mutate: addOfferItems } = useAddOfferItems();
	const { mutateAsync: publishOffer } = usePublishOffer();

	// I would have to add the offerId and the itemId to this function?
	// I def have the itemId as a part of the tenderItems array.
	// I just have to get the offerId from somewhere
	const handleSave = () => {
		// ! Just for testing, I *need* to get this from the database
		const offerId = 5;

		// const newData: TenderItemsOffer = [...tenderItems];
		// console.log('NEWDATA', newData);
		// const rowToUpdate = newData[selectedRow];
		const rowToUpdate = tenderItems![selectedRow];
		rowToUpdate.cost = cost;
		rowToUpdate.notes = notes;
		rowToUpdate.offerId = offerId;
		setSelectedRow(-1);
		setButtonText('Add to Table');
		setCost(0);
		setNotes('');
		console.log('This should mutate the offerItems');
		addOfferItems(rowToUpdate);
	};

	const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCost(Number(e.target.value));
		setButtonText('Add to Table');
	};

	const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNotes(e.target.value);
		setButtonText('Add to Table');
	};

	const handleAddToTable = (index: number) => {
		setSelectedRow(index);
		setButtonText('Save');
		setCost(tenderItems![index].cost);
		setNotes(tenderItems![index].notes);
	};

	const handlePublishOffer = () => {
		//! I want to be able to get the offer to use.
		//! I think it would be easiest to get it based on the tenderId
		const offer = {
			offerId: 10, // This shold be the offerId -> coming from the upcoming getOffer function,
			tenderId: 26,
			status: 0,
			statusText: 'statustext',
			notes: 'Testing'
		};

		publishOffer(offer); //! I need to get the offerId here also
		alert('Offer published');
	};

	return (
		<>
			<Table variant={'striped'}>
				{/* <Thead position="sticky" top={0} zIndex="docked">
						// This might come in handy, it makes the table header sticky. It does not look super good, but the functionality is there.
						// Let's keep it commented out and see where it goes.
					*/}
				<Thead>
					<Tr>
						<Tooltip label="Does this item have a product number?">
							<Th>
								<HStack>
									<p>Number</p>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Description of a item">
							<Th>
								<HStack>
									<p>Description</p>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Volume">
							<Th>
								<HStack>
									<p color={'black'}>Volume</p>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Unit of measurement. For example: m2, kg, t">
							<Th>
								<HStack>
									<p>Unit</p>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Add the cost and any notes of this item">
							<Th>
								<HStack>
									<p>Cost & notes</p>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>
					</Tr>
				</Thead>
				<Tbody>
					{tenderItems?.map((item, index) => (
						<Tr key={item.tenderItemId}>
							<Td>{item.nr}</Td>
							<Td>{item.description}</Td>
							<Td>{item.volume}</Td>
							<Td>{item.unit}</Td>
							<Td>
								{selectedRow === index ? (
									<div>
										<Input
											value={cost}
											onChange={handleCostChange}
											placeholder="Cost"
											mr={'2'}
											mb={'1'}
										/>
										<Input
											value={notes}
											onChange={handleNotesChange}
											placeholder="Notes"
											mr={'2'}
											mb={'1'}
										/>
										<Button onClick={handleSave}>{buttonText}</Button>
									</div>
								) : (
									<Button onClick={() => handleAddToTable(index)}>Add</Button>
								)}
							</Td>
						</Tr>
					))}
					{tenderItems?.length === 0 ? (
						<Text fontSize="xl">
							This table is empty. Something is not correct. Please contact the
							administrator.
						</Text>
					) : null}
				</Tbody>
			</Table>
			<Box mt={'4'} flexDirection={'column'}>
				<Text my={'2'}>
					When you have added offers to the items you can publish the offer you have made
				</Text>
				<Button onClick={handlePublishOffer}>Publish offer</Button>
			</Box>
		</>
	);
};
