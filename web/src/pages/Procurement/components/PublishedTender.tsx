import {
	Box,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
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
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState } from '../../../components/empty/EmptyState';
import { ImportantIcon } from '../../../components/icons/ImportantIcon';
import { Bidder, TenderItem } from '../../../models/Tender';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../utils/StringUtils';
import { OtherGigoverFile } from '../../Files/new/components/OtherFile';
import { DropZone } from '../Offers/components/UploadTenderDocuments';
import { InviteButton } from './InviteButton';
import { FileUploadType } from '../../../models/FileUploadType';

export const PublishedTender = ({ tender }): JSX.Element => {
	const { tenderId } = useParams();
	const handleDelivery = tender?.delivery ? 'Yes' : 'No';
	const time = tender?.finishDate;
	const date = new Date(time!);
	const finishDateStatus = handleFinishDate(time); // we use this to update the UI based on the finish date
	// const finishDateStatus = false;
	const bidders = tender?.bidders;
	const tenderDocuments = tender?.documents;

	const getUniqueBidders = useMemo(() => {
		return () => {
			const uniqueBidders: Bidder[] = [];

			bidders.forEach((bidder) => {
				const existingBidder = uniqueBidders.find((b) => b.email === bidder.email);
				if (!existingBidder) {
					uniqueBidders.push(bidder);
				}
			});

			return uniqueBidders;
		};
	}, [bidders]);

	const uniqueBidders = getUniqueBidders();
	// console.log('uniqueBidders', uniqueBidders);
	const tenderDescForEmail = tender?.description;

	const tenderItems: TenderItem[] | undefined = tender?.items;

	return (
		<Box p={6}>
			<Box p={2}>
				<Flex direction={'column'}>
					<Box
						mb={1}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
						<Grid templateColumns="repeat(2, 1fr)" gap={4}>
							<GridItem colSpan={1}>
								<Box>
									<VStack>
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
													{tender?.status === 1
														? 'Published'
														: 'Not published'}
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
														<Text fontSize={'lg'}>
															{formatDateWithoutTime(date)}*
														</Text>
													</HStack>
												</Tooltip>
												<HStack>
													<Text fontWeight={'bold'} fontSize={'xl'}>
														Phone:
													</Text>
													<Text fontSize={'lg'}>
														{tender?.phoneNumber}
													</Text>
												</HStack>
											</VStack>
										</HStack>
									</VStack>
								</Box>
							</GridItem>
							<GridItem colSpan={1}>
								<Box marginRight={'6'}>
									<VStack ml={'3'}>
										<VStack>
											<Tooltip
												hasArrow
												label="Here you can see the bidders that have a Gigover account"
											>
												<HStack>
													<Text fontWeight={'bold'} fontSize={'xl'}>
														Bidders
													</Text>
													<ImportantIcon size={16} />
												</HStack>
											</Tooltip>
										</VStack>
										<VStack>
											<Table variant="simple" size="sm" colorScheme="black">
												<Thead>
													<Tr>
														<Td>Name</Td>
														<Td>Email</Td>
														<Td>Will make an offer</Td>
													</Tr>
												</Thead>
												<Tbody>
													{uniqueBidders?.map((bidder) => {
														let offerStatus;
														let statusColor;
														if (bidder.status === 0) {
															// BidderReject
															offerStatus = 'No';
															statusColor = 'red';
														}
														if (bidder.status === 1) {
															// BidderAccept
															offerStatus = 'Yes';
															statusColor = 'green';
														}
														if (bidder.status === 2) {
															// BidderNotAnswered
															offerStatus = 'Not answered';
															statusColor = 'gray';
														}
														return (
															<Tr key={bidder.email}>
																<Td>
																	<Text>{bidder.name}</Text>
																</Td>
																<Td>
																	<Text>{bidder.email}</Text>
																</Td>
																<Td>
																	<Text color={statusColor}>
																		{offerStatus}
																	</Text>
																</Td>
															</Tr>
														);
													})}
												</Tbody>
											</Table>
										</VStack>
									</VStack>
								</Box>
							</GridItem>
						</Grid>
					</Box>
				</Flex>

				{/* text to say its published */}
				<Flex justifyContent={'flex-end'} marginTop={'3'} marginBottom={'3'}>
					<Text as={'b'}>Published Tender</Text>
				</Flex>
			</Box>

			<Table variant={'striped'}>
				<Thead>
					<Tr>
						<Th width={'20%'}>
							<Tooltip hasArrow label="Cost code">
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
									<Text color={'black'}>Volume</Text>
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

			<Flex alignItems={'center'} mt={'6'}>
				<Box>
					{finishDateStatus ? (
						<Text marginTop={'2'} marginBottom={'2'} color={'gray.500'}>
							The finish date has passed, you can&apos;t invite more bidders
						</Text>
					) : (
						<InviteButton tenderId={tenderId} tenderDesc={tenderDescForEmail} />
					)}
				</Box>
			</Flex>

			<Box>
				<Box p={2}>
					<DropZone
						propertyId={0}
						offerId={0}
						projectId={0}
						uploadType={FileUploadType.Tender}
						tenderId={Number(tenderId)}
					/>
				</Box>
				{tenderDocuments!.length > 0 ? (
					<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
						<Heading size={'md'}>Files you added to this Tender</Heading>
						{tenderDocuments!
							.sort((a, b) => (b.created && a.created ? b.created - a.created : -1))
							.map((p, pIndex) => (
								<OtherGigoverFile key={pIndex} showDelete={true} file={p} />
							))}
					</VStack>
				) : (
					<EmptyState
						title={'No files uploaded'}
						text={'Upload files to this tender to share them with the bidders'}
					/>
				)}
			</Box>
		</Box>
	);
};
