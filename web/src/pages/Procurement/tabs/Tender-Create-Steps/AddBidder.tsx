import { useCallback, useEffect, useState } from 'react';
import { useInviteBidder } from '../../../../mutations/procurement/useInviteBidder';
import { useGetUserByEmail } from '../../../../queries/useGetUserByEmail';
import { devError, devInfo } from '../../../../utils/ConsoleUtils';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	Text,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Table,
	HStack,
	Spacer,
	Tbody,
	Td,
	Th,
	Thead,
	Tooltip,
	Tr,
	VStack
} from '@chakra-ui/react';
import { Theme } from '../../../../Theme';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { TenderItem } from '../../../../models/Tender';

export interface InviteBidderProps {
	tenderId: number;
	onBidderAdded: () => void;
}

export const AddBidder = ({ tenderId, onBidderAdded }: InviteBidderProps): JSX.Element => {
	const { data } = useGetTenderById(tenderId);
	const tender = data?.tender;

	const time = tender?.finishDate;
	const date = new Date(time!);
	const handleDelivery = tender?.delivery ? 'Yes' : 'No';

	const tenderItems: TenderItem[] | undefined = tender?.items;

	const [searchMail, setSearchMail] = useState('');
	const [inviteSuccess, setInviteSuccess] = useState(false);
	const inviteMutation = useInviteBidder();
	const searchMutation = useGetUserByEmail();
	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				devInfo('Found user with uId:', response.uId);
				// Add to tender
				inviteMutation.mutateAsync({ uId: response.uId, tenderId }).then((res) => {
					if (res.errorCode === 'OK') {
						setSearchMail('');
						setInviteSuccess(true);
					} else {
						throw new Error('Could not invite user.');
					}
				});
			}
		} catch (e) {
			//
			devError(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);

	useEffect(() => {
		if (inviteSuccess) {
			setTimeout(() => {
				setInviteSuccess(false);
			}, 3500);
		}
	}, [inviteSuccess]);

	return (
		<Box backgroundColor={'white'} py={6} rounded={'md'}>
			<Flex justifyContent={'center'}>
				<Heading size={'md'}>Add Bidders</Heading>
			</Flex>

			<Box>
				<Accordion>
					<AccordionItem>
						<h2>
							<AccordionButton>
								<Box as="span">Tender Info</Box>
								<AccordionIcon />
							</AccordionButton>
						</h2>
						<AccordionPanel pb={4}>
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
												<Text fontSize={'lg'}>{tender?.phoneNumber}</Text>
											</HStack>
										</VStack>
									</HStack>
								</Flex>

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
												<Tooltip
													hasArrow
													label="Unit of measurement. For example: m2, kg, t"
												>
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
							</Box>
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</Box>

			<Box px={10} py={4}>
				<FormControl
					isRequired={true}
					isInvalid={searchMutation.isError || inviteMutation.isError}
					mb={4}
				>
					<FormLabel htmlFor={'inviteEmail'}>E-mail</FormLabel>
					<Input
						placeholder={'Enter e-mail address of a Gigover user'}
						name={'inviteEmail'}
						value={searchMail}
						onChange={(e) => setSearchMail(e.target.value)}
					/>
					{inviteSuccess ? (
						<>
							<Text mt={4} color={Theme.colors.green}>
								User has been invited to the project
							</Text>
						</>
					) : (
						(searchMutation.isError || inviteMutation.isError) && (
							<FormErrorMessage>
								The user with email {searchMail} could not be found or has already
								been invited.
							</FormErrorMessage>
						)
					)}
				</FormControl>
				<Flex justifyContent={'flex-end'}>
					<Button
						variant={'outline'}
						colorScheme={'gray'}
						loadingText={'Inviting'}
						isLoading={searchMutation.isLoading || inviteMutation.isLoading}
						disabled={searchMutation.isLoading || inviteMutation.isLoading}
						onClick={search}
					>
						Invite
					</Button>
				</Flex>
			</Box>
		</Box>
	);
};
