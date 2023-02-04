import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTenderById } from '../../../mutations/getTenderById';
import { Tender } from '../../../models/Tender';
import {
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	VStack,
	Text
} from '@chakra-ui/react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ModalContext } from '../../../context/ModalContext';

export const ProcurementHeader = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { tenderId } = useParams();
	const { data, isLoading, isError, error } = useTenderById(Number(tenderId));
	const tender: Tender | undefined = data && data.tender;

	// const { mutate: modify, isLoading, isError, error } = useModifyTender();
	// const { register, handleSubmit, errors, control } = useForm<ProjectFormData>();
	// add tender as the default values? Means I have to send the tender as a prop to this component??

	// TODO is it a good idea to use the GlobalModal for modifying the tender also?
	// make another modal component for the modifyTender.

	// TODO change this to not be a form. The button opens the modal where you can edit the Tender
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
											<FormControl id={'description'}>
												<FormLabel fontWeight={'bold'} fontSize={'lg'}>
													Description:
												</FormLabel>
												<Text>{tender?.description}</Text>
											</FormControl>
										</HStack>
										<HStack>
											<FormControl id={'terms'}>
												<FormLabel fontWeight={'bold'} fontSize={'lg'}>
													Terms:
												</FormLabel>
												<Text>{tender?.terms}</Text>
											</FormControl>
										</HStack>
										<HStack>
											<FormControl id={'address'}>
												<FormLabel fontWeight={'bold'} fontSize={'lg'}>
													Address:
												</FormLabel>
												<Text>{tender?.address}</Text>
											</FormControl>
										</HStack>
										<HStack>
											<FormControl id={'delivery'}>
												<FormLabel fontWeight={'bold'} fontSize={'lg'}>
													Delivery:
												</FormLabel>
												<Text>{tender?.delivery}</Text>
											</FormControl>
										</HStack>
									</VStack>
									<VStack>
										<HStack>
											<FormControl id={'finishDate'}>
												<FormLabel fontWeight={'bold'} fontSize={'lg'}>
													Finish Date:
												</FormLabel>
												<Text>{tender?.finishDate}</Text>
											</FormControl>
										</HStack>
										<HStack>
											<FormControl id={'phoneNumber'}>
												<FormLabel fontWeight={'bold'} fontSize={'lg'}>
													Phone:
												</FormLabel>
												<Text>{tender?.phoneNumber}</Text>
											</FormControl>
										</HStack>
										<HStack>
											<FormControl id={'address'}>
												<FormLabel fontWeight={'bold'} fontSize={'lg'}>
													Project name:
												</FormLabel>
												<Text>{tender?.projectName}</Text>
											</FormControl>
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
