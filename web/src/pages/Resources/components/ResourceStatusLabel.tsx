import styled from 'styled-components';
import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

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
const ResourceStatusLabel = ({ status }) => {
	const getLabelProps = (s: number) => {
		if (status === 0) {
			return {
				label: 'available',
				color: 'green'
			};
		} else if (status === 1) {
			return {
				label: 'in use',
				color: 'red'
			};
		} else if (status === 2) {
			return {
				label: 'in repair',
				color: 'orange'
			};
		}
		return {
			label: 'unknown',
			color: 'black'
		};
	};

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

export default ResourceStatusLabel;
