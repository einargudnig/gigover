import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';

interface NotificationsProps {}

export const Notifications = ({ ...props }: NotificationsProps): JSX.Element => {
	return (
		<Box p={6}>
			<Heading mb={4} fontSize={'18px'}>
				Notifications
			</Heading>
			<Box width={'100%'} height={'400px'} overflow={'scroll'}>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => {
					return <Notification key={s} />;
				})}
			</Box>
		</Box>
	);
};

const Notification = () => {
	return (
		<Flex
			my={1}
			borderTop={'2px solid #f3f3f3'}
			py={2}
			align={'center'}
			cursor={'pointer'}
			onClick={() => alert('do something')}
		>
			<Avatar size={'md'} mr={4} />
			<Box flex={1}>
				<Flex justify={'space-between'}>
					<Text fontWeight={'bold'}>Jon peturssson</Text>
					<Text fontSize={'12px'} color={'gray.400'}>
						29 min ago
					</Text>
				</Flex>
				<Text fontSize={'14px'}>Commentaði á task 29</Text>
			</Box>
		</Flex>
	);
};
