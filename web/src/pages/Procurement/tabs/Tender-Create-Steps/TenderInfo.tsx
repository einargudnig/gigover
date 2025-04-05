import {
	Box,
	Flex,
	HStack,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	VStack
} from '@chakra-ui/react';
import { TenderItem } from '../../../../models/Tender';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export function TenderInfo({ tender }) {
	const time = tender?.finishDate;
	const date = new Date(time!);
	const handleDelivery = tender?.delivery ? 'Yes' : 'No';

	const tenderItems: TenderItem[] | undefined = tender?.items;

	return (
		<Box px={10} py={4}>
			<Flex
				justifyContent={'space-around'}
				marginTop={3}
				p={2}
				border={'1px'}
				borderColor={'gray.500'}
				rounded={'md'}
			>
				<VStack mb={'4'}>
					<HStack>
						<Text fontWeight={'bold'} fontSize={'xl'}>
							Description:
						</Text>
						<Text fontSize={'lg'}>{tender?.description}</Text>
					</HStack>
					<HStack>
						<Text fontWeight={'bold'} fontSize={'xl'}>
							Terms:
						</Text>
						<Text fontSize={'lg'}>{tender?.terms}</Text>
					</HStack>
					<HStack>
						<Text fontWeight={'bold'} fontSize={'xl'}>
							Status:
						</Text>
						<Text fontSize={'lg'}>
							{tender?.status === 1 ? 'Published' : 'Not published'}
						</Text>
					</HStack>
				</VStack>

				<HStack mb={'4'}>
					<VStack mr={'3'}>
						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Address:
							</Text>
							<Text fontSize={'lg'}>{tender?.address}</Text>
						</HStack>
						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Delivery:
							</Text>
							<Text fontSize={'lg'}>{handleDelivery}</Text>
						</HStack>
					</VStack>
					<Spacer />
					<VStack ml={'3'}>
						<Tooltip
							hasArrow
							label="You will not be able to answer offer until this date has passed"
						>
							<HStack>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Close Date:
								</Text>
								<Text fontSize={'lg'}>{formatDateWithoutTime(date)}*</Text>
							</HStack>
						</Tooltip>
						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Phone:
							</Text>
							<Text fontSize={'lg'}>{tender?.phoneNumber}</Text>
						</HStack>
					</VStack>
				</HStack>
			</Flex>

			<Table variant={'striped'}>
				<Thead>
					<Tr>
						<Th width={'20%'}>
							<Tooltip hasArrow label="Code">
								<Text>Number</Text>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip hasArrow label="Description of a item">
								<Text>Description</Text>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip hasArrow label="Volume">
								<Text color={'black'}>Volume</Text>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip hasArrow label="Unit of measurement. For example: m2, kg, t">
								<Text>Unit</Text>
							</Tooltip>
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					<>
						{tenderItems?.map((item) => (
							<Tr key={item.tenderItemId}>
								<Td width={'20%'}>{item.nr}</Td>
								<Td width={'20%'}>{item.description}</Td>
								<Td width={'20%'}>{item.volume}</Td>
								<Td width={'20%'}>{item.unit}</Td>
							</Tr>
						))}
					</>
				</Tbody>
			</Table>
		</Box>
	);
}
