import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTenderById } from '../../../mutations/getTenderById';
import { Tender } from '../../../models/Tender';
import { Box, Button, Center, Flex, Heading, HStack, VStack, Text, Spacer } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ModalContext } from '../../../context/ModalContext';
// import { formatDate } from '../../../utils/StringUtils';

export const ProcurementHeader = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { tenderId } = useParams();
	const { data, isLoading, isError, error } = useTenderById(Number(tenderId));
	const tender: Tender | undefined = data && data.tender;

	// TODO
	//? Should I add the projectName like I do on the /procurement page?
	// It would be nice but it's not necessary.

	// wire the edit button to send the info to the modal
	// make the modal modify work to update the tender

	// TODO handle the finish date
	// Should I handle the finishDate here?
	// console.log(typeof tender?.finishDate); // number
	// if (tender?.finishDate === undefined) {
	// 	return <p>N/A</p>;
	// } else {
	// 	return formatDate(tender?.finishDate);
	// }

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
					<Center>
						<Heading as={'h4'} size={'md'}>
							Procurement
						</Heading>
					</Center>
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
											<Text fontSize={'lg'}>{tender?.delivery}</Text>
										</HStack>
									</VStack>
									<Spacer />
									{/* Finish date and phone */}
									<VStack ml={'3'}>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Finish Date:
											</Text>
											<Text fontSize={'lg'}>
												{tender?.finishDate}
												{/* {formatDate(tender?.finishDate)} */}
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
								<Button
									pos={'absolute'}
									bottom={'0'}
									right={'0'}
									onClick={() =>
										setModalContext({
											modifyTender: { modifyTender: tender }
										})
									}
								>
									Edit
								</Button>
							</VStack>
						</Box>
					</Flex>
				</div>
			)}
		</>
	);
};
