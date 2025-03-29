import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Bid } from '../../../../../models/Tender';
import { formatDateWithoutTime } from '../../../../../utils/StringUtils';

export function BidInfo({ bid }: { bid: Bid }) {
	const status = () => {
		return bid.status === 1 ? 'Published' : 'Not Published';
	};

	const handleDelivery = () => {
		return bid.delivery ? 'Yes' : 'No';
	};

	const time = bid?.finishDate;
	const date = new Date(time!);

	return (
		<Box mb={1} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
			<Flex justify={'space-between'}>
				<Box w={'45%'}>
					<VStack>
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

						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Address:
							</Text>
							<Text fontSize={'lg'}>{bid.address}</Text>
						</HStack>
					</VStack>
				</Box>

				<Box w={'45%'}>
					<VStack>
						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Delivery:
							</Text>
							<Text fontSize={'lg'}>{handleDelivery()}</Text>
						</HStack>

						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Close Date:
							</Text>
							<Text fontSize={'lg'}>{formatDateWithoutTime(date)}</Text>
						</HStack>

						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Client email:
							</Text>
							<Text fontSize={'lg'}>{bid.clientEmail}</Text>
						</HStack>
						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Notes:
							</Text>
							<Text fontSize={'lg'}>{bid.notes}</Text>
						</HStack>
					</VStack>
				</Box>
			</Flex>
		</Box>
	);
}
