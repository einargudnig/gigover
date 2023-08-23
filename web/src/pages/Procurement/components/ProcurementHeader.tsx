import React, { useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteProcurement } from '../../../mutations/useDeleteProcurement';
import {
	Box,
	Button,
	Flex,
	HStack,
	VStack,
	Text,
	Spacer,
	useToast,
	Table,
	Tr,
	Td,
	Thead,
	Tooltip
} from '@chakra-ui/react';
import { ImportantIcon } from '../../../components/icons/ImportantIcon';
import { ModalContext } from '../../../context/ModalContext';
import { formatDateWithoutTime } from '../../../utils/StringUtils';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { TrashIcon } from '../../../components/icons/TrashIcon';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { useGetUserByEmail } from '../../../queries/useGetUserByEmail';

export const ProcurementHeader = ({ tender }): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const navigate = useNavigate();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [searchResult, setSearchResult] = useState<string | null>(null);
	const { mutateAsync: deleteProcurementAsync, isLoading: isLoadingDelete } =
		useDeleteProcurement();

	const handleDelivery = tender?.delivery ? 'Yes' : 'No';

	const time = tender?.finishDate;
	const date = new Date(time!);
	const finishDateStatus = handleFinishDate(time); // we use this to update the UI based on the finish date
	const bidders = tender?.bidders;

	const searchMutation = useGetUserByEmail();
	const search = useCallback(
		async (email: string) => {
			const response = await searchMutation.mutateAsync({ email });
			if (response.uId) {
				console.log('Yes');
				setSearchResult('Yes');
			} else {
				console.log('No');
				setSearchResult('No');
			}
		},
		[searchMutation]
	);

	// useEffect(() => {
	// 	search(bidders.email);
	// }, [search, bidders.email]);

	const toast = useToast();
	return (
		<>
			<div style={{ width: '100%' }}>
				<Flex direction={'column'}>
					<Box
						mb={2}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
						<Flex>
							<Box marginLeft={'6'}>
								<VStack>
									{/* First stack of description, terms and status */}
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

									{/* Second stack of address, delivery, finish date and phone */}
									<HStack mb={'4'}>
										{/* Address and delivery */}
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
											<HStack>
												<Text fontWeight={'bold'} fontSize={'xl'}>
													Close Date:
												</Text>
												<Text fontSize={'lg'}>
													{formatDateWithoutTime(date)}
												</Text>
											</HStack>
											<HStack>
												<Text fontWeight={'bold'} fontSize={'xl'}>
													Phone:
												</Text>
												<Text fontSize={'lg'}>{tender?.phoneNumber}</Text>
											</HStack>
										</VStack>
									</HStack>
								</VStack>
							</Box>
							{/* Bidders */}
							<Spacer />
							{bidders.length > 0 && (
								<Box marginRight={'6'}>
									<VStack ml={'3'}>
										<VStack>
											<Tooltip label="Here you can see the bidders that already have Gigover account">
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
														{/* <Td>Gigover account</Td> */}
													</Tr>
												</Thead>
												{bidders?.map((bidder) => (
													<Tr key={bidder.email}>
														<Td>
															<Text>{bidder.name}</Text>
														</Td>
														<Td>
															<Text>{bidder.email}</Text>
														</Td>
														{/* <Td>{searchResult}</Td> */}
													</Tr>
												))}
											</Table>
										</VStack>
									</VStack>
								</Box>
							)}
						</Flex>
					</Box>
				</Flex>

				{/* button to edit or delete tender */}
				{finishDateStatus ? (
					<Flex justifyContent={'flex-end'} marginTop={'2'} marginBottom={'2'}>
						<Text as={'b'}>
							The finish date has passed, you cannot edit or delete the tender
						</Text>
					</Flex>
				) : (
					<Flex justifyContent={'flex-end'} marginTop={'2'} marginBottom={'2'}>
						<HStack>
							<Button
								onClick={() =>
									setModalContext({
										modifyTender: { modifyTender: tender }
									})
								}
							>
								Edit tender
							</Button>
							{tender === undefined ? null : (
								<ConfirmDialog
									header={'Delete procurement'}
									setIsOpen={setDialogOpen}
									callback={async () => {
										if (tender.status === 1) {
											toast({
												title: 'Cannot delete published tender',
												description:
													'This tender has been published and cannot be deleted',
												status: 'error',
												duration: 2000,
												isClosable: true
											});
										} else {
											await deleteProcurementAsync(tender);
											navigate('/tender');
										}
										setDialogOpen(false);
									}}
									isOpen={dialogOpen}
								>
									<Button
										aria-label={'Delete'}
										colorScheme={'red'}
										isLoading={isLoadingDelete}
										leftIcon={<TrashIcon color={'white'} size={20} />}
										onClick={() => {
											setDialogOpen(true);
										}}
									>
										Delete tender
									</Button>
								</ConfirmDialog>
							)}
						</HStack>
					</Flex>
				)}
			</div>
		</>
	);
};
