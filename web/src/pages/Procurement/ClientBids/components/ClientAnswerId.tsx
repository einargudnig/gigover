import {
	Box,
	Grid,
	GridItem,
	HStack,
	VStack,
	Text,
	Table,
	Thead,
	Tr,
	Th,
	Tooltip,
	Tbody,
	Td
} from '@chakra-ui/react';
import React from 'react';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';

export const ClientAnswerId = (): JSX.Element => {
	return (
		<>
			{/* Bid Header */}
			<Box mb={1} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
				<Grid templateColumns="repeat(3, 1fr)" gap={4}>
					<GridItem colSpan={1}>
						<Box>
							<VStack>
								<VStack mb={'4'}>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Description:
										</Text>
										{/* <Text fontSize={'lg'}>{clientBid.description}</Text> */}
										<Text fontSize={'lg'}>description</Text>
									</HStack>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Terms:
										</Text>
										{/* <Text fontSize={'lg'}>{clientBid.terms}</Text> */}
										<Text fontSize={'lg'}>terms</Text>
									</HStack>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Status:
										</Text>
										{/* <Text fontSize={'lg'}>{clientBid.status}</Text> */}
										<Text fontSize={'lg'}>status</Text>
									</HStack>
								</VStack>

								<HStack mb={'4'}>
									<VStack mr={'3'}>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Address:
											</Text>
											{/* <Text fontSize={'lg'}>{clientBid.address}</Text> */}
											<Text fontSize={'lg'}>address</Text>
										</HStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Delivery:
											</Text>
											{/* <Text fontSize={'lg'}>{handleDelivery}</Text> */}
											<Text fontSize={'lg'}>delivery</Text>
										</HStack>
									</VStack>
									<VStack ml={'3'}>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Close Date:
											</Text>
											{/* <Text fontSize={'lg'}>{formatDateWithoutTime(date)}</Text> */}
											{/* <Text fontSize={'lg'}>{clientBid.finishDate}</Text> */}
											<Text fontSize={'lg'}>finishdate</Text>
										</HStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Phone:
											</Text>
											{/* <Text fontSize={'lg'}>{clientBid.phoneNumber}</Text> */}
											<Text fontSize={'lg'}>phoneNumber</Text>
										</HStack>
									</VStack>
								</HStack>
							</VStack>
						</Box>
					</GridItem>
					<GridItem colSpan={1}>
						<Box marginRight={'6'}>
							<VStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Bidder
								</Text>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Name:
									</Text>
									{/* <Text fontSize={'lg'}>{clientBid.bidder.name}</Text> */}
									<Text fontSize={'lg'}>name</Text>
								</HStack>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Email:
									</Text>
									{/* <Text fontSize={'lg'}>{clientBid.bidder.email}</Text> */}
									<Text fontSize={'lg'}>email</Text>
								</HStack>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Company:
									</Text>
									{/* <Text fontSize={'lg'}>{bidder.company}</Text> */}
									<Text fontSize={'lg'}>company</Text>
								</HStack>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Address:
									</Text>
									{/* <Text fontSize={'lg'}>{bidder.address}</Text> */}
									<Text fontSize={'lg'}>address</Text>
								</HStack>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Phone:
									</Text>
									{/* <Text fontSize={'lg'}>{bidder.phoneNumber}</Text> */}
									<Text fontSize={'lg'}>phoneNumber</Text>
								</HStack>
							</VStack>
						</Box>
					</GridItem>
					<GridItem colSpan={1}>
						<Box marginRight={'6'}>
							<VStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Client
								</Text>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Email:
									</Text>
									{/* <Text fontSize={'lg'}>{client.email}</Text> */}
									<Text fontSize={'lg'}>email</Text>
								</HStack>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Address:
									</Text>
									{/* <Text fontSize={'lg'}>{client.address}</Text> */}
									<Text fontSize={'lg'}>address</Text>
								</HStack>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Phone:
									</Text>
									{/* <Text fontSize={'lg'}>{client.phoneNumber}</Text> */}
									<Text fontSize={'lg'}>phoneNumber</Text>
								</HStack>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Other:
									</Text>
									{/* <Text fontSize={'lg'}>{client.other}</Text> */}
									<Text fontSize={'lg'}>other</Text>
								</HStack>
							</VStack>
						</Box>
					</GridItem>
				</Grid>
			</Box>

			{/* Table */}
			<Table variant={'striped'}>
				<Thead>
					<Tr>
						<Th width={'20%'}>
							<Tooltip label="Cost code">
								<HStack>
									<Text>Number</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip label="Description of a item">
								<HStack>
									<Text>Description</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip label="Volume">
								<HStack>
									<Text color={'black'}>Volume</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip label="Unit of measurement. For example: m2, kg, t">
								<HStack>
									<Text>Unit</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					<>
						{/* {tenderItems?.map((item) => (
							<Tr key={item.tenderItemId}>
								<Td width={'20%'}>{item.nr}</Td>
								<Td width={'20%'}>{item.description}</Td>
								<Td width={'20%'}>{item.volume}</Td>
								<Td width={'20%'}>{item.unit}</Td>
							</Tr>
						))} */}
						Table body
					</>
				</Tbody>
			</Table>
		</>
	);
};
