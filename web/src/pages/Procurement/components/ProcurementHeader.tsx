import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTenderById } from '../../../queries/useGetTenderById';
import { useDeleteProcurement } from '../../../mutations/useDeleteProcurement';
import { Tender } from '../../../models/Tender';
import { Box, Button, Flex, HStack, VStack, Text, Spacer } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ModalContext } from '../../../context/ModalContext';
import { formatDateWithoutTime } from '../../../utils/StringUtils';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { TrashIcon } from '../../../components/icons/TrashIcon';
import { InviteButton } from './InviteButton';

export const ProcurementHeader = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { tenderId } = useParams();
	const navigate = useNavigate();
	const [dialogOpen, setDialogOpen] = useState(false);
	const { data, isLoading, isError, error } = useTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	const tenderDescForEmail = tender?.description;
	const { mutateAsync: deleteProcurementAsync, isLoading: isLoadingDelete } =
		useDeleteProcurement();

	// Let's leave this as it is for now.
	// Instead of overdoing things and render a checkbox that will never be checked.
	const handleDelivery = tender?.delivery ? 'Yes' : 'No';
	// TODO
	//? Should I add the projectName like I do on the /procurement page?

	// Handling the date from the backend, it's fine for now
	const time = tender?.finishDate;
	const date = new Date(time!);

	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : isError ? (
				<Text>
					{error?.errorCode} went wrong - {error?.errorCode}
				</Text>
			) : (
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
							<VStack pos={'relative'}>
								{/* First stack of desc and terms */}
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
								<HStack pos={'absolute'} bottom={'0'} right={'0'}>
									<InviteButton tenderDesc={tenderDescForEmail} />
									<Button
										onClick={() =>
											setModalContext({
												modifyTender: { modifyTender: tender }
											})
										}
									>
										Edit
									</Button>
									{tender === undefined ? null : (
										<ConfirmDialog
											header={'Delete procurement'}
											setIsOpen={setDialogOpen}
											callback={async (b) => {
												if (b) {
													await deleteProcurementAsync(tender);
													navigate('/procurement');
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
												Delete
											</Button>
										</ConfirmDialog>
									)}
								</HStack>
							</VStack>
						</Box>
					</Flex>
				</div>
			)}
		</>
	);
};
