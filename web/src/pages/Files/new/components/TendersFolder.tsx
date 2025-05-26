import { Box, Center, Flex, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { CardBaseLink } from '../../../../components/CardBase';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { FolderIcon } from '../../../../components/icons/FolderIcon';
import { colorGenerator } from '../../../../hooks/colorGenerator';
import { useUserTenders } from '../../../../queries/procurement/useUserTenders';

export const TendersFolder = (): JSX.Element => {
	const { data, isPending } = useUserTenders();

	return (
		<Flex direction="column" height="100%">
			<Flex flex={1} height="100%" width="100%">
				<Box flex="1 0 auto" height="100%" p={3} overflowY="auto">
					{isPending ? (
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
										<CardBaseLink
											to={`/files/tender/tenders/${t.tenderId}`}
											key={t.tenderId}
										>
											<Flex direction="column" alignItems={'stretch'} gap={4}>
												<Flex
													justifyContent={'space-between'}
													alignItems={'center'}
												>
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
												</Flex>
												<Flex gap={1}>
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
												</Flex>
												<Flex gap={1}>
													<Text as={'b'}>Tender Id:</Text>
													<Text>{t.tenderId}</Text>
												</Flex>
												{/* <Flex>
													<Text as={'b'}>Number of files:</Text>
													<Text>{t.documents.length()}</Text>
												</Flex> */}
											</Flex>
										</CardBaseLink>
									))}
								</>
							)}
						</>
					)}
				</Box>
			</Flex>
		</Flex>
	);
};
