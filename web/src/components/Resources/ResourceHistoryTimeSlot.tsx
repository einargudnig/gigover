import { Box, Flex, Text } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import Countdown from 'react-countdown';
import { Resource } from '../../models/Resource';
import { ResourceHistoryItem } from '../../models/ResourceHistoryItem';
import { LocationPinIcon } from '../icons/LocationPinIcon';
import { ResourceTimeRenderer } from './ResourceTimeRenderer';

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
		<Box
			padding={1.5}
			background={inUse ? '#ffedec' : '#fff'}
			boxShadow="0 5px 15px rgba(0, 0, 0, 0.04)"
			borderRadius="md"
			color={inUse ? '#9b4633' : '#000'}
			width="100%"
			height="70px"
			fontSize="14px"
			display={inUse ? 'flex' : 'block'}
			alignItems={inUse ? 'center' : 'initial'}
			fontWeight={inUse ? 'bold' : 'initial'}
			sx={{
				p: {
					margin: 0
				}
			}}
		>
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
							{DateTime.fromJSDate(dateInUse).toFormat('HH:mm')}
						</Text>
					</Flex>
					<Flex justify={'space-between'} align={'center'}>
						<Flex justify={'flex-start'} align={'center'}>
							<LocationPinIcon /> <p style={{ margin: 0 }}>View location</p>
						</Flex>
						<Text fontWeight={'bold'} color={'#000'}>
							{DateTime.fromJSDate(dateInUse).toFormat('dd. MMM yyyy')}
						</Text>
					</Flex>
				</>
			)}
		</Box>
	);
};
