import { Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import Countdown from 'react-countdown';
import styled, { css } from 'styled-components';
import { Resource } from '../../models/Resource';
import { ResourceHistoryItem } from '../../models/ResourceHistoryItem';
import { LocationPinIcon } from '../icons/LocationPinIcon';
import { ResourceTimeRenderer } from './ResourceTimeRenderer';

const TimeslotContainer = styled.div<{ inUse: boolean }>`
	padding: ${(props) => props.theme.padding(1.5)};
	background: #fff;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.04);
	border-radius: ${(props) => props.theme.borderRadius};
	color: #000;
	width: 100%;
	height: 70px;
	font-size: 14px;

	${(props) =>
		props.inUse &&
		css`
			background: #ffedec;
			color: #9b4633;
			display: flex;
			align-items: center;
			font-weight: bold;
		`};

	p {
		margin: 0;
	}
`;

export interface ResourceHistoryTimeSlotProps {
	inUse: boolean;
	isHold: boolean;
	resource: Resource;
	item: ResourceHistoryItem;
}

export const ResourceHistoryTimeSlot = ({
	inUse,
	isHold,
	resource,
	item
}: ResourceHistoryTimeSlotProps): JSX.Element => {
	const startDate = new Date(item.start);
	const endDate = item.stop ? new Date(item.stop) : new Date();
	const dateInUse = isHold ? startDate : endDate;

	return (
		<TimeslotContainer inUse={inUse}>
			{inUse ? (
				<Flex direction="column" align="flex-start">
					<div style={{ fontWeight: 'normal' }}>Resource is still in use</div>
					<Flex justify="flex-start" align="center">
						<span>Timer:&nbsp;</span>
						<Countdown
							date={startDate}
							daysInHours={false}
							overtime={true}
							renderer={ResourceTimeRenderer}
						/>
					</Flex>
				</Flex>
			) : (
				<>
					<Flex justify={'space-between'} align={'center'}>
						<p>
							{isHold ? 'Holding' : 'Releasing'} resource [{resource.name}]
						</p>
						<Text fontWeight={'bold'} color={'#000'}>
							{format(dateInUse, 'HH:mm')}
						</Text>
					</Flex>
					<Flex justify={'space-between'} align={'center'}>
						<Flex justify={'flex-start'} align={'center'}>
							<LocationPinIcon /> <p style={{ margin: 0 }}>View location</p>
						</Flex>
						<Text fontWeight={'bold'} color={'#000'}>
							{format(dateInUse, 'dd. MMM yyyy')}
						</Text>
					</Flex>
				</>
			)}
		</TimeslotContainer>
	);
};
