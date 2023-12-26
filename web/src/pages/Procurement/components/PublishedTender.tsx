import React, { useMemo, useState } from 'react';
import { TenderItem, Bidder } from '../../../models/Tender';
import { useParams, Link } from 'react-router-dom';
import {
	Box,
	Grid,
	GridItem,
	Flex,
	HStack,
	VStack,
	Text,
	Spacer,
	Table,
	Tr,
	Td,
	Thead,
	Tbody,
	Th,
	Tooltip,
	Button,
	Heading
} from '@chakra-ui/react';
import { ImportantIcon } from '../../../components/icons/ImportantIcon';
import { formatDateWithoutTime } from '../../../utils/StringUtils';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { InviteButton } from './InviteButton';
import { UploadTenderDocuments } from '../Offers/components/UploadTenderDocuments';
import { EmptyState } from '../../../components/empty/EmptyState';
import { OtherGigoverFile } from '../../Files/new/components/OtherFile';

export const PublishedTender = ({ tender }): JSX.Element => {
	const { tenderId } = useParams();
	const [upload, setUpload] = useState(false);
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
		<>
			{upload && (
				<UploadTenderDocuments
					onClose={() => setUpload(false)}
					onComplete={(status) => {
						console.log('status', status);
					}}
					tenderId={Number(tenderId)}
				/>
			)}

			<div style={{ width: '100%' }}>
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
												<Tooltip label="You will not be able to answer offer until this date has passed">
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
											<Tooltip label="Here you can see the bidders that have a Gigover account">
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
			</div>

			<Table variant={'striped'}>
				<Thead>
					<Tr>
						<Th width={'20%'}>
							<HStack>
								<Text>Number</Text>
								<ImportantIcon size={20} />
							</HStack>
						</Th>

						<Tooltip label="Description of a item">
							<Th width={'20%'}>
								<HStack>
									<Text>Description</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Volume">
							<Th width={'20%'}>
								<HStack>
									<Text color={'black'}>Volume</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Unit of measurement. For example: m2, kg, t">
							<Th width={'20%'}>
								<HStack>
									<Text>Unit</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>
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
				<Spacer />
				<Flex>
					<Box>
						<Button onClick={() => setUpload(true)} ml={'1'}>
							Upload files
						</Button>
					</Box>
					<Spacer />
					<Box>
						<Button ml={'1'}>
							<Link to={`/tender/tender-offer/${Number(tenderId)}`}>
								Published offers
							</Link>
						</Button>
					</Box>
					<Spacer />
					<Box>
						<Button ml={'1'}>
							<Link to={`../../files/tender/tenders/${Number(tenderId)}`}>
								View files from offers
							</Link>
						</Button>
					</Box>
				</Flex>
			</Flex>

			<div>
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
			</div>
		</>
	);
};
