import React, { useContext } from 'react';
import { ModalContext } from '../../../context/ModalContext';
import { Box, Button, Center, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useModifyTender } from '../../../mutations/useModifyTender';
import { Edit } from '../../../components/icons/Edit';

// const update = await axios.post(ApiService.editTender);

export const ProcurementHeader = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	const { mutate: modify, isLoading, isError, error } = useModifyTender();
	// add tender as the default values? Means I have to send the tender as a prop to this component??

	return (
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
									<Text>This needs to be good</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Terms:
									</Text>
									<Text>These are the terms</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Address:
									</Text>
									<Text>Dufnaholar 10</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Delivery:
									</Text>
									<Text>Yes</Text>
								</HStack>
							</VStack>
							<VStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Finish Date:
									</Text>
									<Text>2021-05-05</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Phone:
									</Text>
									<Text>1234567</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Delivery Address:
									</Text>
									<Text>Dufnaholar 10</Text>
								</HStack>
							</VStack>
							{/* <Button pos={'absolute'} bottom={'0'} right={'0'}>
								Edit
							</Button> */}
							<Button
								pos={'absolute'}
								bottom={'0'}
								right={'0'}
								leftIcon={<Edit size={14} />}
								onClick={(event) => {
									event.preventDefault();
									setModalContext({});
								}}
							>
								Edit
							</Button>
						</HStack>
					</Box>
				</Flex>
			</Center>
		</>
	);
};
