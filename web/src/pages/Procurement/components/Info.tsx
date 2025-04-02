import { Box, Flex, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { formatDateWithoutTime } from '../../../utils/StringUtils';

interface InfoField {
	label: string;
	value: string | number | undefined;
	tooltip?: string;
}

interface InfoProps {
	fields: InfoField[];
}

export function Info({ fields }: InfoProps): JSX.Element {
	// Split fields into two arrays for left and right columns
	const midPoint = Math.ceil(fields.length / 2);
	const leftFields = fields.slice(0, midPoint);
	const rightFields = fields.slice(midPoint);

	const FieldGroup = ({ groupFields }: { groupFields: InfoField[] }) => (
		<VStack>
			{groupFields.map((field, index) => (
				<HStack key={index}>
					<Text fontWeight="bold" fontSize="xl">
						{field.label}:
					</Text>
					{field.tooltip ? (
						<Tooltip hasArrow label={field.tooltip}>
							<Text fontSize="lg">
								{typeof field.value === 'number' &&
								(field.label.toLowerCase().includes('date') ||
									field.label.toLowerCase().includes('through'))
									? formatDateWithoutTime(new Date(field.value))
									: field.value?.toString()}
							</Text>
						</Tooltip>
					) : (
						<Text fontSize="lg">
							{typeof field.value === 'number' &&
							(field.label.toLowerCase().includes('date') ||
								field.label.toLowerCase().includes('through'))
								? formatDateWithoutTime(new Date(field.value))
								: field.value?.toString()}
						</Text>
					)}
				</HStack>
			))}
		</VStack>
	);

	return (
		<Box mb={1} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
			<Flex justify={'space-between'}>
				<Box w={'45%'}>
					<FieldGroup groupFields={leftFields} />
				</Box>
				<Box w={'45%'}>
					<FieldGroup groupFields={rightFields} />
				</Box>
			</Flex>
		</Box>
	);
}

// Example usage for different types:

// For Tender:
// const tenderFields = [
//   { label: 'Description', value: tender.description },
//   { label: 'Terms', value: tender.terms },
//   { label: 'Address', value: tender.address },
//   { label: 'Delivery', value: tender.delivery ? 'Yes' : 'No' },
//   {
//     label: 'Close Date',
//     value: tender.finishDate,
//     tooltip: 'You will not be able to answer offer until this date has passed'
//   },
//   { label: 'Phone', value: tender.phoneNumber },
// ];
// <Info fields={tenderFields} title="Tender Information" />

// For Offer:
// const offerFields = [
//   { label: 'Description', value: offer.description },
//   { label: 'Status', value: offer.statusText },
//   { label: 'Notes', value: offer.notes },
//   { label: 'Bidder', value: offer.name },
// ];
// <Info fields={offerFields} title="Offer Information" />

// For Bid:
// const bidFields = [
//   { label: 'Description', value: bid.description },
//   { label: 'Terms', value: bid.terms },
//   { label: 'Address', value: bid.address },
//   { label: 'Delivery', value: bid.delivery ? 'Yes' : 'No' },
//   { label: 'Valid Through', value: bid.finishDate },
//   { label: 'Status', value: getBidStatus(bid.status) },
// ];
// <Info fields={bidFields} title="Bid Information" />
