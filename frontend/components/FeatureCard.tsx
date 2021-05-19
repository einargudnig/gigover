import React from 'react';
import styled from 'styled-components';
import { Feature } from '../models/PageBlock';
import { MessagingFeatureIcon } from './icons/MessagingFeatureIcon';
import { EstimatesAndReportsFeatureIcon } from './icons/EstimatesAndReportsFeatureIcon';
import { TimeTrackingFeatureIcon } from './icons/TimeTrackingFeatureIcon';
import { TaskManagementFeatureIcon } from './icons/TaskManagementFeatureIcon';

interface FeatureCardProps {
	feature: Feature;
}

const FeatureCardStyled = styled.div`
	border-radius: ${(props) => props.theme.borderRadius};
	background-color: ${(props) => props.theme.colors.gray['200']};
	padding: ${(props) => props.theme.padding(4)};
`;

const IconContainer = styled.div`
	margin-bottom: ${(props) => props.theme.padding(3)};
`;

export const FeatureCard = ({ feature }: FeatureCardProps): JSX.Element => {
	const { icon, title, description } = feature;

	return (
		<FeatureCardStyled>
			<IconContainer>
				{icon === 'message' && <MessagingFeatureIcon />}
				{icon === 'report' && <EstimatesAndReportsFeatureIcon />}
				{icon === 'timer' && <TimeTrackingFeatureIcon />}
				{icon === 'tasks' && <TaskManagementFeatureIcon />}
			</IconContainer>
			<h4>{title}</h4>
			<p>{description}</p>
		</FeatureCardStyled>
	);
};
