import styled from 'styled-components';
import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { ResourceStatus } from '../../../models/Resource';

const StatusLabelWrapper = styled(Flex)`
	border-radius: 16px;
	border: 1px solid black;
	color: black;
	position: relative;
	padding: 4px 16px;
	font-variant: small-caps;
`;
const Ball = styled(Box)`
	height: 8px;
	margin-right: 8px;
	width: 8px;
	border-radius: 50%;
`;

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
		<StatusLabelWrapper
			width={'fit-content'}
			borderColor={labelProps.color}
			alignItems={'center'}
			justifyContent={'center'}
		>
			<Ball background={labelProps.color} />
			<Text fontWeight={'bold'} color={labelProps.color}>
				{labelProps.label}
			</Text>
		</StatusLabelWrapper>
	);
};
