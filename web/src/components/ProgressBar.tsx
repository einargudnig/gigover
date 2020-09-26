import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
	percent: number;
}

const ProgressBarStyled = styled.div<ProgressBarProps>`
	width: 100%;

	> p:first-child {
		font-size: 11px;
		text-align: right;
	}

	.bar {
		margin: 6px 0;
		background: #e9e9ef;
		height: 6px;
		border-radius: 3px;
		overflow: hidden;

		.progress {
			height: 100%;
			width: ${(props) => props.percent}%;
			background-color: #1fdf83;
			border-radius: 3px;
		}
	}
`;

export const ProgressBar = ({ percent }: ProgressBarProps): JSX.Element => {
	return (
		<ProgressBarStyled percent={percent}>
			<p>{percent}%</p>
			<div className={'bar'}>
				<div className={'progress'} />
			</div>
		</ProgressBarStyled>
	);
};
