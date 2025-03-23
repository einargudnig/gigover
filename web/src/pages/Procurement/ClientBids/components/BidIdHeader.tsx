import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	HStack,
	Text,
	VStack,
	useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { TrashIcon } from '../../../../components/icons/TrashIcon';
import { Bid } from '../../../../models/Tender';
import { useDeleteBid } from '../../../../mutations/procurement/client-bids/useDeleteBid';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export const BidIdHeader = ({ bid }): JSX.Element => {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<Box mb={1} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
			{isEditing ? <EditBidForm bid={bid} /> : <BidInfo bid={bid} />}
			<BidHeaderActions bid={bid} />
		</Box>
	);
};

function EditBidForm({ bid }: { bid: Bid }) {
	return (
		<Box>
			<Text>Edit bid</Text>
		</Box>
	);
}

function BidInfo({ bid }: { bid: Bid }) {
	const handleDelivery = bid?.delivery ? 'Yes' : 'No';
	const time = bid?.finishDate;
	const date = new Date(time!);

	const status = () => {
		if (bid?.status === 0) {
			return <Text color={'gray'}>Unpublished</Text>;
		} else if (bid?.status === 1) {
			return <Text>Published</Text>;
		} else if (bid?.status === 2) {
			return (
				<Text fontSize={'lg'} color={'red'}>
					Rejected
				</Text>
			);
		} else if (bid?.status === 3) {
			return (
				<Text fontSize={'lg'} color={'green'}>
					Accepted
				</Text>
			);
		}
		return 'Unknown';
	};
	return (
		<Grid templateColumns="repeat(4, 1fr)" gap={4}>
			<GridItem colSpan={2}>
				<Box>
					<VStack>
						<VStack mb={'4'}>
							<HStack>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Description:
								</Text>
								<Text fontSize={'lg'}>{bid.description}</Text>
							</HStack>
							<HStack>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Terms:
								</Text>
								<Text fontSize={'lg'}>{bid.terms}</Text>
							</HStack>
							<HStack>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Status:
								</Text>
								<Text fontSize={'lg'}>{status()}</Text>
							</HStack>
						</VStack>

						<HStack mb={'4'}>
							<VStack mr={'3'}>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Address:
									</Text>
									<Text fontSize={'lg'}>{bid.address}</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Delivery:
									</Text>
									<Text fontSize={'lg'}>{handleDelivery}</Text>
								</HStack>
							</VStack>
							<VStack ml={'3'}>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Close Date:
									</Text>
									<Text fontSize={'lg'}>{formatDateWithoutTime(date)}</Text>
								</HStack>
							</VStack>
						</HStack>
					</VStack>
				</Box>
			</GridItem>
			<GridItem colSpan={2}>
				<Box marginRight={'6'}>
					<VStack ml={'3'}>
						<HStack ml={'3'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Notes:
							</Text>
							<Text fontSize={'lg'}>{bid.notes}</Text>
						</HStack>
						<HStack ml={'3'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Client email:
							</Text>
							<Text fontSize={'lg'}>{bid.clientEmail}</Text>
						</HStack>
					</VStack>
				</Box>
			</GridItem>
		</Grid>
	);
}

export function BidHeaderActions({ bid }: { bid: Bid }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const { mutateAsync: deleteBidAsync, isLoading: isLoadingDelete } = useDeleteBid();
	const finishDateStatus = handleFinishDate(bid?.finishDate);

	const toast = useToast();
	const navigate = useNavigate();

	return (
		<Flex justifyContent={'flex-end'} marginTop={'1'} marginBottom={'2'}>
			{!finishDateStatus ? (
				<HStack>
					<Button
						variant={'outline'}
						colorScheme={'black'}
						onClick={() => console.log('edit bid')}
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
									navigate('/tender/bids');
								}
								setDialogOpen(false);
							}}
							isOpen={dialogOpen}
						>
							<Button
								aria-label={'Delete'}
								colorScheme={'red'}
								variant={'outline'}
								isLoading={isLoadingDelete}
								leftIcon={<TrashIcon color={'red'} size={20} />}
								onClick={() => {
									setDialogOpen(true);
								}}
							>
								Delete bid
							</Button>
						</ConfirmDialog>
					)}
				</HStack>
			) : (
				<Text as="b" color={'black'}>
					You cannot edit or delete when the finish date has passed!
				</Text>
			)}
		</Flex>
	);
}
