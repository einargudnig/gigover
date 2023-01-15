import React from 'react';
import {
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Input,
	Text,
	VStack
} from '@chakra-ui/react';
import { ProjectFormData, useModifyTender } from '../../../mutations/useModifyTender';
import { Controller, useForm } from 'react-hook-form';

// const update = await axios.post(ApiService.editTender);

export const ProcurementHeader = (): JSX.Element => {
	const { mutate: modify, isLoading, isError, error } = useModifyTender();
	const { register, handleSubmit, errors, control } = useForm<ProjectFormData>();
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
									{/* <Text>Einar</Text> */}
									<Input value="This needs to be good" />
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Terms:
									</Text>
									{/* <Text>Einar</Text> */}
									<Input value="This are the terms" />
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Address:
									</Text>
									{/* <Text>Dufnaholar 10</Text> */}
									<Input value="Dufnaholar 10" />
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Delivery:
									</Text>
									{/* <Text>Yes, I need a big car</Text> */}
									<Input value="yes" />
								</HStack>
							</VStack>
							<VStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Date:
									</Text>
									<Text>22 December</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Seller:
									</Text>
									<Text>BYKO</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Phone:
									</Text>
									{/* <Text>12345678</Text> */}
									<Input value="1234567" />
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Delivery Address:
									</Text>
									{/* <Text>Dufnaholar 10</Text> */}
									<Input value="Dufnaholar 10" />
								</HStack>
							</VStack>
							<Button pos={'absolute'} bottom={'0'} right={'0'}>
								Edit
							</Button>
						</HStack>
					</Box>
				</Flex>
			</Center>
		</>
	);
};
