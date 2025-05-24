import {
	Box,
	Center,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	Text,
	Tooltip
} from '@chakra-ui/react';
import styled from 'styled-components';
import { CardBaseLink } from '../../../../components/CardBase';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { TenderWithItems } from '../../../../models/Tender';
import { useUserTenders } from '../../../../queries/procurement/useUserTenders';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

const ProcurementCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	margin-bottom: 4px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

export const TenderOffersList = (): JSX.Element => {
	const { data: userTenders, isPending } = useUserTenders();
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
			<Tooltip hasArrow label="Offers will not be answered until this date has passed">
				<HStack>
					<Text as={'b'}>Close date:</Text>
					<Text>{formatDateWithoutTime(new Date(finishDate))}*</Text>
				</HStack>
			</Tooltip>
		);
	};

	const shouldDeliver = (tender: TenderWithItems) => {
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
				<Heading size={'md'}>Offers sent to the tenders that you have created</Heading>
			</Flex>
			{isPending ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{userTenders
						.slice()
						.reverse()
						.map((t) => (
							<ProcurementCardStyled
								to={`/tender/tender-offer/${t.tenderId}`}
								key={t.tenderId}
							>
								<Flex direction={'column'}>
									<Grid templateColumns="repeat(4, 1fr)" gap={1}>
										<GridItem colSpan={2}>
											<HStack>
												<Text as={'b'}>Project:</Text>
												<Text color={'black'}>{t.projectName}</Text>
											</HStack>
											<HStack>
												<Text as={'b'}>Description:</Text>
												<Text color={'black'}>{t.description}</Text>
											</HStack>
										</GridItem>
										<GridItem colSpan={1}>
											<HStack>
												<Text as={'b'}>Phone number:</Text>
												<Text color={'black'}>{t.phoneNumber}</Text>
											</HStack>
											<HStack>
												<Text as={'b'}>Tender status:</Text>
												<Text color={'black'}>
													{t.status === 1 ? 'Published' : 'Not published'}
												</Text>
											</HStack>
										</GridItem>
										<GridItem colSpan={1}>
											<HStack>{shouldDeliver(t)}</HStack>
										</GridItem>
										<GridItem colSpan={1}>
											{finishDateStatus(t.finishDate)}
										</GridItem>
									</Grid>
								</Flex>
							</ProcurementCardStyled>
						))}
				</>
			)}
		</Box>
	);
};
