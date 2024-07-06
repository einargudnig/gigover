import styled from 'styled-components';

interface ProgressBarProps {
	percent: number;
	secondaryProgress?: number;
}

const ProgressBarStyled = styled.div<ProgressBarProps>`
	width: 100%;

	> p:first-child {
		font-size: 11px;
		text-align: right;

		span {
			color: #1fdf83;
		}
	}

	.bar {
		margin: 6px 0;
		background: #e9e9ef;
		height: 6px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;

		.progress,
		.in-progress {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			border-radius: 3px;
			transition: all 0.2s linear;
		}

		.in-progress {
			background-color: #f9dc97;
			width: ${(props) => props.secondaryProgress ?? 0}%;
		}

		.progress {
			background-color: #1fdf83;
			width: ${(props) => props.percent}%;
		}
	}
`;

export const ProgressBar = ({ percent, secondaryProgress = 0 }: ProgressBarProps): JSX.Element => {
	return (
		<ProgressBarStyled percent={percent} secondaryProgress={percent + secondaryProgress}>
			<p>
				{secondaryProgress > 0 && (
					<>
						{secondaryProgress.toFixed(0)}% In progress <span>&bull;</span>{' '}
					</>
				)}
				{percent.toFixed(0)}% Done
			</p>
			<div className={'bar'}>
				{secondaryProgress && <div className={'in-progress'} />}
				<div className={'progress'} />
			</div>
		</ProgressBarStyled>
	);
};
