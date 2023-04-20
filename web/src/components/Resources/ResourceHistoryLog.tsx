import React from 'react';
import { Resource } from '../../models/Resource';
import { useResourceHistory } from '../../queries/useResourceHistory';
import { LoadingSpinner } from '../LoadingSpinner';
import { ResourceHistoryTimeSlot } from './ResourceHistoryTimeSlot';
import styled from 'styled-components';
import { Flex } from '@chakra-ui/react';

const ResourceHistoryItem = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	flex-direction: column;
	gap: ${(props) => props.theme.padding(2)};

	&:not(:last-child) {
		margin-top: ${(props) => props.theme.padding(6)};
	}
`;

const ResourceTimeSlots = styled.div`
	display: flex;
	gap: ${(props) => props.theme.padding(2)};
	justify-content: space-evenly;
	align-items: center;
`;

const ResourceHistoryUser = styled.div`
	padding: ${(props) => props.theme.padding(1)} ${(props) => props.theme.padding(2)};
	font-weight: normal;
	font-size: 14px;
	border-radius: 24px;
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.06);
	background: #fff;
	color: #838894;
	display: inline-flex;
`;

const ResourceLogDescription = styled.p`
	margin-top: -${(props) => props.theme.padding(1.5)};
	font-size: 12px;
	color: #838894;
	font-style: italic;

	strong {
		color: #000;
	}
`;

export interface ResourceHistoryLogProps {
	resource: Resource;
}

export const ResourceHistoryLog = ({ resource }: ResourceHistoryLogProps): JSX.Element => {
	const { data, isLoading, isError, error } = useResourceHistory(resource);

	if (isLoading) {
		return (
			<div>
				<LoadingSpinner />
			</div>
		);
	}

	if (isError) {
		return <div>{error?.errorText}</div>;
	}

	return (
		<Flex direction="column-reverse">
			{data?.resources.length === 0 && <p>No logs available</p>}
			{data?.resources.map((i) => (
				<>
					<ResourceHistoryItem>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<ResourceHistoryUser>{i.userName}</ResourceHistoryUser>
						</div>
						{i.projectName && i.projectName.length > 0 && (
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<ResourceLogDescription>
									Resource used in project: <strong>{i.projectName}</strong>&nbsp;
									{i.taskName && i.taskName.length > 0 && (
										<>
											in task: <strong>{i.taskName}</strong>
										</>
									)}
								</ResourceLogDescription>
							</div>
						)}
						<ResourceTimeSlots>
							<ResourceHistoryTimeSlot
								inUse={false}
								isHold={true}
								item={i}
								resource={resource}
							/>
							<ResourceHistoryTimeSlot
								isHold={false}
								inUse={i.stop === null}
								item={i}
								resource={resource}
							/>
						</ResourceTimeSlots>
					</ResourceHistoryItem>
				</>
			))}
		</Flex>
	);
};
