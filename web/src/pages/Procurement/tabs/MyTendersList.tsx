import { Box, Flex, Grid, GridItem, HStack, Heading, Text, Tooltip } from '@chakra-ui/react';
import styled from 'styled-components';
import { CardBaseLink } from '../../../components/CardBase';
import { NoProcurementFound } from '../../../components/empty/NoProcurementFound';
import { Tender } from '../../../models/Tender';
import { useUserTenders } from '../../../queries/procurement/useUserTenders';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../utils/StringUtils';
import { ProcurementListSkeleton } from '../ProcurementListSkeleton';

const ProcurementCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;
	margin-bottom: 8px;
	margin-top: 8px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

export function MyTendersList() {
	const { data, isPending } = useUserTenders();

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
			{isPending ? (
				<ProcurementListSkeleton />
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
									<ProcurementCardStyled to={`${t.tenderId}`} key={t.tenderId}>
										<Flex direction={'column'}>
											<Grid templateColumns="repeat(4, 1fr)" gap={1}>
												<GridItem colSpan={2}>
													<HStack>
														<Text as={'b'}>Project:</Text>
														<Text color={'black'}>{t.projectName}</Text>
													</HStack>
													<HStack>
														<Text as={'b'}>Tender description:</Text>
														<Text color={'black'}>{t.description}</Text>
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
														<Text color={'black'}>{t.phoneNumber}</Text>
													</HStack>
													<HStack>
														<Text as={'b'}>Tender status:</Text>
														<Text color={'black'}>{offerStatus}</Text>
													</HStack>
												</GridItem>
												<GridItem colSpan={1}>
													<HStack>{shouldDeliver(t)}</HStack>
												</GridItem>
											</Grid>
										</Flex>
									</ProcurementCardStyled>
								);
							})
					)}
				</>
			)}
		</Box>
	);
}
