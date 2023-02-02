import React, { useContext } from 'react';
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
	VStack
} from '@chakra-ui/react';
// import { ProjectFormData, useModifyTender } from '../../../mutations/useModifyTender';
// import { Controller, useForm } from 'react-hook-form';
// import { DatePicker } from '../../../components/forms/DatePicker';
import { ModalContext } from '../../../context/ModalContext';

// const update = await axios.post(ApiService.editTender);

export const ProcurementHeader = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	// const { mutate: modify, isLoading, isError, error } = useModifyTender();
	// const { register, handleSubmit, errors, control } = useForm<ProjectFormData>();
	// add tender as the default values? Means I have to send the tender as a prop to this component??

	// TODO is it a good idea to use the GlobalModal for modifying the tender also?
	// It would mean that I would either have to use the ProcuermentModal component and that one uses the addTender from the API.
	// I would have to make it dynamic.... OR make anoother component for the modifyTender.
	// In that way I could maybe just 'skip' the modal?

	//! Maybe I should ask for a tenders/tender/{tenderId} endpoint? That would help with this procurementHeader component.
	// Maybe I could use the modifyTender endpoint for this, but I'll do it later.
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
									<FormControl id={'description'}>
										<FormLabel fontWeight={'bold'} fontSize={'lg'}>
											Description:
										</FormLabel>
										<Input value="This needs to be good" />
									</FormControl>
								</HStack>
								<HStack>
									<FormControl id={'terms'}>
										<FormLabel fontWeight={'bold'} fontSize={'lg'}>
											Terms:
										</FormLabel>
										{/* <Text>Einar</Text> */}
										<Input value="This are the terms" />
									</FormControl>
								</HStack>
								<HStack>
									<FormControl id={'address'}>
										<FormLabel fontWeight={'bold'} fontSize={'lg'}>
											Address:
										</FormLabel>
										{/* <Text>Dufnaholar 10</Text> */}
										<Input value="Dufnaholar 10" />
									</FormControl>
								</HStack>
								<HStack>
									<FormControl id={'delivery'}>
										<FormLabel fontWeight={'bold'} fontSize={'lg'}>
											Delivery:
										</FormLabel>
										{/* <Text>Yes, I need a big car</Text> */}
										<Input value="yes" />
									</FormControl>
								</HStack>
							</VStack>
							<VStack>
								<HStack>
									<FormControl id={'finishDate'}>
										<FormLabel fontWeight={'bold'} fontSize={'lg'}>
											Finish Date:
										</FormLabel>
										{/* <Controller
											name="finishDate"
											control={control}
											// defaultValue={tender?.finishDate ? new Date(tender.finishDate) : null}
											defaultValue={new Date()}
											render={({ onChange, value, onBlur }) => (
												<DatePicker
													selected={value}
													onChange={(date) => {
														if (date) {
															onChange((date as Date).getTime());
														} else {
															onChange(null);
														}
													}}
													onBlur={onBlur}
												/>
											)}
										/> */}
									</FormControl>
								</HStack>
								<HStack>
									<FormControl id={'phoneNumber'}>
										<FormLabel fontWeight={'bold'} fontSize={'lg'}>
											Phone:
										</FormLabel>
										<Input value="1234567" />
									</FormControl>
								</HStack>
								<HStack>
									<FormControl id={'address'}>
										<FormLabel fontWeight={'bold'} fontSize={'lg'}>
											Delivery Address:
										</FormLabel>
										{/* <Text>Dufnaholar 10</Text> */}
										<Input value="Dufnaholar 10" />
									</FormControl>
								</HStack>
							</VStack>
							<Button
								pos={'absolute'}
								bottom={'0'}
								right={'0'}
								onClick={() =>
									setModalContext({ modifyTender: { modifyTender: undefined } })
								}
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
