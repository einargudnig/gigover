import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center, Text, VStack, HStack, Heading } from '@chakra-ui/react';
import { FolderIcon } from '../../../../components/icons/FolderIcon';
import { colorGenerator } from '../../../../hooks/colorGenerator';
import { useUserTenders } from '../../../../queries/procurement/useUserTenders';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

const FolderCard = styled(CardBaseLink)<{ selected?: boolean }>`
	${(props) =>
		props.selected &&
		css`
			background: #000;
			color: #fff !important;
			box-shadow: none;
		`};
`;

export const TendersFolder = (): JSX.Element => {
	const { data, isLoading } = useUserTenders();

	return (
		<VStack style={{ height: '100%' }}>
			<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
				<Container>
					{isLoading ? (
						<Center>
							<LoadingSpinner />
						</Center>
					) : (
						<>
							{!data || data.length <= 0 ? (
								<Text>
									There are no files here because you have not published a tender.
									You can publish one on the{' '}
									<Link to={'/tender'}>
										<Text textColor={'black'}>tender page</Text>
									</Link>
									.
								</Text>
							) : (
								<>
									<Heading size={'md'}>Tenders</Heading>
									{data.map((t) => (
										<FolderCard
											to={`/files/tender/tenders/${t.tenderId}`}
											key={t.tenderId}
										>
											<VStack align={'stretch'} spacing={4}>
												<HStack justify={'space-between'} align={'center'}>
													<FolderIcon
														color={
															colorGenerator(
																`${t.description}`,
																150,
																50
															).backgroundColor
														}
														size={32}
													/>
													{/* <Text>{o.tender.description}</Text> */}
												</HStack>
												<HStack>
													<Heading
														as={'h4'}
														size={'sm'}
														fontWeight={'bold'}
													>
														Tender Description:
													</Heading>
													<Heading
														as={'h4'}
														size={'sm'}
														fontWeight={'normal'}
													>
														{t.description}
													</Heading>
												</HStack>
												<HStack>
													<Text as={'b'}>Tender Id:</Text>
													<Text>{t.tenderId}</Text>
												</HStack>
												{/* <HStack>
										<Text as={'b'}>Number of files:</Text>
										<Text>{t.documents.length()}</Text>
									</HStack> */}
											</VStack>
										</FolderCard>
									))}
								</>
							)}
						</>
					)}
				</Container>
			</HStack>
		</VStack>
	);
};
