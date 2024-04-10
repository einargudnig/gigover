import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BidIdHeader } from './BidIdHeader';
import { BidIdTable } from './BidIdTable';
import { Box, Button, Flex, HStack, Text, useToast } from '@chakra-ui/react';
import { useGetBidById } from '../../../../queries/procurement/client-bids/useGetBidById';
import { usePublishBid } from '../../../../mutations/procurement/client-bids/usePublishBid';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { ModalContext } from '../../../../context/ModalContext';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Bid } from '../../../../models/Tender';
import { Center } from '../../../../components/Center';
import { useDeleteBid } from '../../../../mutations/procurement/client-bids/useDeleteBid';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { TrashIcon } from '../../../../components/icons/TrashIcon';

export const BidId = (): JSX.Element => {
	const { bidId } = useParams<{ bidId: string }>();
	const [, setModalContext] = useContext(ModalContext);
	const [dialogOpen, setDialogOpen] = useState(false);
	const navigate = useNavigate();
	const { data, isLoading } = useGetBidById(Number(bidId)); // TODO add error handling
	const bid: Bid | undefined = data?.bid;
	// console.log({ bid });
	const bidItems = bid?.items;

	const toast = useToast();

	const finishDateStatus = handleFinishDate(bid?.finishDate);
	const clientBidStatus = bid?.status;

	const { mutateAsync: publishBid, isLoading: isPublishLoading } = usePublishBid();
	const { mutateAsync: deleteBidAsync, isLoading: isLoadingDelete } = useDeleteBid();

	const handlePublish = async () => {
		const publishBidBody = {
			bidId: Number(bidId)
		};

		if (data !== undefined) {
			try {
				await publishBid(publishBidBody);
				toast({
					title: 'Bid published',
					description: 'Bid has been published!',
					status: 'success',
					duration: 2000,
					isClosable: true
				});
			} catch (error) {
				console.log('ERROR', { error });
				toast({
					title: 'Error',
					description: 'Something went wrong when we tried to publish your bid.',
					status: 'error',
					duration: 3000,
					isClosable: true
				});
			}
		} else {
			toast({
				title: 'Error',
				description: 'Something went wrong when we tried to publish your bid.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
	};

	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<div style={{ width: '100%' }}>
					<Flex direction={'column'}>
						<BidIdHeader bid={bid} />
						<Flex justifyContent={'flex-end'} marginTop={'1'} marginBottom={'2'}>
							<HStack>
								<Button
									onClick={() =>
										setModalContext({
											editBid: { bid: bid }
										})
									}
								>
									Edit Bid
								</Button>
								{bid === undefined ? null : (
									<ConfirmDialog
										header={'Delete bid'}
										setIsOpen={setDialogOpen}
										callback={async () => {
											if (bid?.status === 1) {
												toast({
													title: 'Cannot delete published bid',
													description:
														'This bid has been published and cannot be deleted',
													status: 'error',
													duration: 2000,
													isClosable: true
												});
											} else {
												await deleteBidAsync(bid);
												navigate('/tender/create-bid');
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
						<BidIdTable bidItems={bidItems} />
						<Box marginTop={12}>
							{/* <Grid templateColumns="repeat(3, 1fr)" gap={2}>
								<GridItem colSpan={2}>
									<BidIdText />
								</GridItem>
								<GridItem colSpan={1}>
									<Flex alignItems={'center'}>
										<Button>Upload files</Button>
									</Flex>
								</GridItem>
							</Grid> */}
						</Box>
						<Flex justifyContent={'flex-end'} alignItems={'center'} marginTop={'4'}>
							{!finishDateStatus ? (
								<>
									{clientBidStatus === 0 ? (
										<Flex>
											<Box>
												<Button onClick={handlePublish} mr={'2'}>
													{isPublishLoading ? (
														<LoadingSpinner />
													) : (
														'Publish Bid'
													)}
												</Button>
											</Box>
										</Flex>
									) : (
										<Text mr={'2'} as="b">
											You have already published the Tender
										</Text>
									)}
								</>
							) : (
								<Flex alignItems={'center'} justifyContent={'center'}>
									<Text>
										The finish date has passed, you cannot publish or delete the
										tender.
									</Text>
								</Flex>
							)}
						</Flex>
					</Flex>
				</div>
			)}
		</>
	);
};
