import {
	Box,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	LinkBox,
	LinkOverlay,
	Text,
	Tooltip
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { CardBaseLink } from '../../../components/CardBase';
import { DataFetchingErrorBoundary } from '../../../components/ErrorBoundary';
import { NoProcurementFound } from '../../../components/empty/NoProcurementFound';
import { Tender } from '../../../models/Tender';
import { useUserTenders } from '../../../queries/procurement/useUserTenders';
import { ApiService } from '../../../services/ApiService';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../utils/StringUtils';

export function MyTendersList() {
	const { data, isPending, isError, error } = useUserTenders();

	const queryClient = useQueryClient();

	const finishDateStatus = (finishDate: number) => {
		const res = handleFinishDate(finishDate);

		if (res === true) {
			return (
				<HStack>
					<Text>Tender was closed on:</Text>
					<Text>{formatDateWithoutTime(new Date(finishDate))}</Text>
				</HStack>
			);
		}
		return (
			<Tooltip hasArrow label="You cannot answer offers until this date has passed">
				<HStack>
					<Text as={'b'}>Close date:</Text>
					<Text>{formatDateWithoutTime(new Date(finishDate))}*</Text>
				</HStack>
			</Tooltip>
		);
	};

	const shouldDeliver = (tender: Tender) => {
		if (tender.delivery === 1) {
			return (
				<HStack>
					<Text as={'b'}>Deliver to:</Text>
					<Text color={'black'}>{tender.address}</Text>
				</HStack>
			);
		}
		return (
			<HStack>
				<Text as={'b'}>Address:</Text>
				<Text color={'black'}>{tender.address}</Text>
			</HStack>
		);
	};

	return (
		<Box p={4}>
			<Flex justify={'start'}>
				<Heading size={'md'}>Tenders that you have created</Heading>
			</Flex>
			<DataFetchingErrorBoundary
				name="MyTendersList"
				apiEndpoint={ApiService.userTenders}
				loadingState={isPending}
				onRetry={() =>
					queryClient.invalidateQueries({ queryKey: [ApiService.userTenders] })
				}
				skeletonCount={8}
			>
				{isError ? (
					(() => {
						throw error;
					})()
				) : (
					<>
						{!data || data.length <= 0 ? (
							<NoProcurementFound />
						) : (
							data
								.slice()
								.reverse()
								.map((t) => {
									let offerStatus;
									if (t.status === 0) {
										offerStatus = 'Unpublished';
									} else if (t.status === 1) {
										offerStatus = 'Published';
									} else {
										offerStatus = 'Unknown';
									}
									return (
										<LinkBox
											as={CardBaseLink}
											to={`${t.tenderId}`}
											key={t.tenderId}
											w="100%"
											maxW="100%"
											h="auto"
											mb="8px"
											mt="8px"
											sx={{
												h3: {
													marginBottom: '16px',
													color: '#000'
												},
												'@media screen and (max-width: 768px)': {
													width: '100%'
												}
											}}
										>
											<LinkOverlay href={`${t.tenderId}`}>
												<Flex direction={'column'}>
													<Grid templateColumns="repeat(4, 1fr)" gap={1}>
														<GridItem colSpan={2}>
															<HStack>
																<Text as={'b'}>Project:</Text>
																<Text color={'black'}>
																	{t.projectName}
																</Text>
															</HStack>
															<HStack>
																<Text as={'b'}>
																	Tender description:
																</Text>
																<Text color={'black'}>
																	{t.description}
																</Text>
															</HStack>
															<HStack>
																<Text size={'xs'}>
																	{finishDateStatus(t.finishDate)}
																</Text>
															</HStack>
														</GridItem>
														<GridItem colSpan={1}>
															<HStack>
																<Text as={'b'}>Phone number:</Text>
																<Text color={'black'}>
																	{t.phoneNumber}
																</Text>
															</HStack>
															<HStack>
																<Text as={'b'}>Tender status:</Text>
																<Text color={'black'}>
																	{offerStatus}
																</Text>
															</HStack>
														</GridItem>
														<GridItem colSpan={1}>
															<HStack>{shouldDeliver(t)}</HStack>
														</GridItem>
													</Grid>
												</Flex>
											</LinkOverlay>
										</LinkBox>
									);
								})
						)}
					</>
				)}
			</DataFetchingErrorBoundary>
		</Box>
	);
}
