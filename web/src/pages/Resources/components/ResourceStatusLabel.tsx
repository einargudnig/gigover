import { Box, Flex, Text } from '@chakra-ui/react';
import { ResourceStatus } from '../../../models/Resource';

interface ResourceStatusLabelProps {
	status: ResourceStatus;
}

const getLabelProps = (s: ResourceStatus) => {
	switch (s) {
		case ResourceStatus.Available: {
			return {
				label: 'Available',
				color: 'green'
			};
		}
		case ResourceStatus.InUse: {
			return {
				label: 'In use',
				color: 'red'
			};
		}
		case ResourceStatus.NotAvailable: {
			return {
				label: 'Not available',
				color: 'orange'
			};
		}
		default: {
			return {
				label: 'unknown',
				color: 'black'
			};
		}
	}
};

export const ResourceStatusLabel = ({ status }: ResourceStatusLabelProps) => {
	const labelProps = getLabelProps(status);

	return (
		<Flex
			width={'fit-content'}
			borderColor={labelProps.color}
			alignItems={'center'}
			justifyContent={'center'}
			borderRadius="16px"
			border="1px solid black"
			color="black"
			position="relative"
			padding="4px 16px"
			sx={{ fontVariant: 'small-caps' }}
		>
			<Box
				background={labelProps.color}
				height="8px"
				marginRight="8px"
				width="8px"
				borderRadius="50%"
			/>
			<Text fontWeight={'bold'} color={labelProps.color}>
				{labelProps.label}
			</Text>
		</Flex>
	);
};
