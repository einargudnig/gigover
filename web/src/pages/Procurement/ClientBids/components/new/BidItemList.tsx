import { Box, HStack, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { ImportantIcon } from '../../../../../components/icons/ImportantIcon';
import { Bid } from '../../../../../models/Tender';

export function BidItemList({ bid }: { bid: Bid }) {
	const bidItems = bid?.items;

	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	return (
		<Box>
			<Table variant={'striped'}>
				<Thead>
					<Tr>
						<Th width={'20%'}>
							<Tooltip hasArrow label="Number">
								<HStack>
									<Text>Number</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip hasArrow label="Description of a item">
								<HStack>
									<Text>Description</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip hasArrow label="Volume">
								<HStack>
									<Text>Volume</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip hasArrow label="Unit of measurement. For example: m2, kg, t">
								<HStack>
									<Text>Unit</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip hasArrow label="Cost">
								<HStack>
									<Text>Cost</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					{bidItems?.map((item) => (
						<Tr key={item.bidItemId}>
							<Td width={'20%'}>{item.nr}</Td>
							<Td width={'20%'}>{item.description}</Td>
							<Td width={'20%'}>{item.volume}</Td>
							<Td width={'20%'}>{item.unit}</Td>
							<Td width={'20%'}>{formatNumber(item.cost!)}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
}
