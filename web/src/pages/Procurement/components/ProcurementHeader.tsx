import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTenderById } from '../../../mutations/getTenderById';
import { Tender } from '../../../models/Tender';
import { Box, Button, Center, Flex, Heading, HStack, VStack, Text } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ModalContext } from '../../../context/ModalContext';

export const ProcurementHeader = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { tenderId } = useParams();
	const { data, isLoading, isError, error } = useTenderById(Number(tenderId));
	const tender: Tender | undefined = data && data.tender;

	// make another modal component for the modifyTender.

	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : isError ? (
				<Text>
					{error?.errorCode} went wrong - {error?.errorCode}
				</Text>
			) : (
				<>
					<Center>
						<Heading as={'h4'} size={'md'}>
							Procurement
						</Heading>
					</Center>
					<Center>
						<Flex direction={'column'}>
							<Box
								mb={2}
								p={4}
								borderRadius={8}
								borderColor={'#EFEFEE'}
								bg={'#EFEFEE'}
								w={'100%'}
							>
								<HStack pos={'relative'} pb={'16'}>
									<VStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'lg'}>
												Description:
											</Text>
											<Text>{tender?.description}</Text>
										</HStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'lg'}>
												Terms:
											</Text>
											<Text>{tender?.terms}</Text>
										</HStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'lg'}>
												Address:
											</Text>
											<Text>{tender?.address}</Text>
										</HStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'lg'}>
												Delivery:
											</Text>
											<Text>{tender?.delivery}</Text>
										</HStack>
									</VStack>
									<VStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'lg'}>
												Finish Date:
											</Text>
											<Text>{tender?.finishDate}</Text>
										</HStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'lg'}>
												Phone:
											</Text>
											<Text>{tender?.phoneNumber}</Text>
										</HStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'lg'}>
												Project name:
											</Text>
											<Text>{tender?.projectName}</Text>
										</HStack>
									</VStack>
									<Button
										pos={'absolute'}
										bottom={'0'}
										right={'0'}
										onClick={() =>
											setModalContext({
												modifyTender: { modifyTender: undefined }
											})
										}
									>
										Edit
									</Button>
								</HStack>
							</Box>
						</Flex>
					</Center>
				</>
			)}
		</>
	);
};
