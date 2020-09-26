import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	flex: 1;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	> div {
		user-select: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 600px;
		text-align: center;

		> * {
			margin: 16px 0;
		}
	}
`;

interface EmptyStateProps {
	title: string;
	text: string;
	icon?: React.ReactNode;
	action?: React.ReactNode;
}

export const EmptyState = ({ title, text, icon, action }: EmptyStateProps): JSX.Element => (
	<Container>
		<div>
			{icon && icon}
			<h2>{title}</h2>
			<p>{text}</p>
			{action && action}
		</div>
	</Container>
);
