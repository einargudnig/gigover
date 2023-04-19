import { useForm } from 'react-hook-form';
import {
	Avatar,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Text
} from '@chakra-ui/react';
import React from 'react';
import { ShareItemContext } from '../../../context/ModalContext';

type FormData = {
	email: string;
};
const ShareItem = ({ shareItem }: { shareItem: ShareItemContext }) => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>();

	const onSubmit = handleSubmit(
		async () => {
			// alert('submiting form');
		},
		() => console.log('invalid')
	);
	console.log(errors, 'rerrrrrr');
	return (
		<div>
			<Flex mb={4} direction={'column'}>
				<Heading mb={4}>Share with other users</Heading>
				<form onSubmit={onSubmit}>
					<FormControl isInvalid={!!errors.email}>
						<InputGroup size="md">
							<Input
								pr="4.5rem"
								placeholder="Add people via email"
								{...register('email', {
									required: 'Required',
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: 'invalid email address'
									}
								})}
							/>
							<InputRightElement width="4.5rem">
								<Button type="submit" h="1.75rem" size="sm">
									{'Add'}
								</Button>
							</InputRightElement>
						</InputGroup>
						<FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
						<FormHelperText>Add email of user you want to add</FormHelperText>
					</FormControl>
				</form>

				{shareItem.project?.workers.map((s, sIndex) => (
					<Flex
						my={4}
						justifyContent={'space-between'}
						alignItems={'center'}
						key={sIndex}
					>
						<Flex alignItems={'center'}>
							<Avatar name={s.name} mr={4} />
							<Box>
								<Text color={'black'} fontSize={'lg'} fontWeight={'500'}>
									{s.name}
								</Text>
								<Text>{s.userName}</Text>
							</Box>
						</Flex>
						<Text a={'i'}>{s.type === 0 ? 'Owner' : 'Worker'}</Text>
					</Flex>
				))}
			</Flex>
			<Heading mb={4}>Get Link</Heading>

			<Flex justifyContent={'space-between'}>
				<Box>
					<Text>
						<b>Restricted </b>
						Only people signed in can open the link
					</Text>
				</Box>
				<Button variant="link" colorScheme="blue">
					Copy link
				</Button>
			</Flex>
		</div>
	);
};

export default ShareItem;
