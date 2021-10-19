import React from 'react';
import { Resource } from '../../models/Resource';
import { useResourceHistory } from '../../queries/useResourceHistory';
import { LoadingSpinner } from '../LoadingSpinner';
import { ResourceHistoryTimeSlot } from './ResourceHistoryTimeSlot';
import styled from 'styled-components';

const ResourceHistoryItem = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	flex-direction: column;
	gap: ${(props) => props.theme.padding(2)};

	&:not(:last-child) {
		margin-bottom: ${(props) => props.theme.padding(6)};
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
	font-weight: bold;
	font-size: 14px;
	border-radius: 24px;
	box-shadow: ${(props) => props.theme.boxShadow};
	background: #fff;
	display: inline-flex;
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
		return <div>{error}</div>;
	}

	console.log('data', data);

	return (
		<div>
			{data?.resources.map((i) => (
				<>
					<ResourceHistoryItem>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<ResourceHistoryUser>{i.uId}</ResourceHistoryUser>
						</div>
						<ResourceTimeSlots>
							<ResourceHistoryTimeSlot inUse={false} />
							<ResourceHistoryTimeSlot inUse={i.stop === null} />
						</ResourceTimeSlots>
					</ResourceHistoryItem>
				</>
			))}
		</div>
	);
};
