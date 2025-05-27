import { Flex, Heading, Text, VStack } from '@chakra-ui/react'; // Added Chakra components
import React from 'react';

interface EmptyStateProps {
	title: string;
	text: string;
	icon?: React.ReactNode;
	action?: React.ReactNode;
}

export const EmptyState = ({ title, text, icon, action }: EmptyStateProps): JSX.Element => (
	<Flex flex={1} width="100%" height="100%" justifyContent="center" alignItems="center">
		<VStack
			userSelect="none"
			alignItems="center"
			maxWidth="600px"
			textAlign="center"
			spacing={4} /* Corresponds to margin: 16px 0 */
		>
			{icon && icon}
			<Heading as="h2" size="lg">
				{title}
			</Heading>
			<Text>{text}</Text>
			{action && action}
		</VStack>
	</Flex>
);
