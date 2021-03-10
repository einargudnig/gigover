import { GridItem, Text, IconButton } from '@chakra-ui/react';
import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { GantChartContext } from '../contexts/GantChartContext';
import { getDateSegments, GRID_ROW_HEIGHT } from '../hooks/useGantChart';
import { colorGenerator } from '../../../hooks/colorGenerator';
import { Chevron } from '../../../components/icons/Chevron';

interface GridProps {
	segments: number;
	milestones?: number;
}

const ClearGrid = styled.div<GridProps>`
	display: grid;
	border: 0;
	overflow: hidden;
	box-sizing: border-box;
	position: relative;
	grid-template-columns: repeat(${(props) => props.segments}, 1fr);
	grid-gap: 0;

	.arrow {
		position: absolute;
		height: 100%;
		width: 40px;
		top: 0;
		bottom: 0;

		&.ar-l {
			left: 0;
			background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
		}

		&.ar-r {
			right: 0;
			background: linear-gradient(-90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
		}
	}
`;

const GantGrid = styled(ClearGrid)<GridProps>`
	border-radius: 12px;
	background: #fafbfc;
	box-shadow: 0 0 1px 1px #eceeef;
	grid-template-rows: repeat(${(props) => props.milestones}, ${GRID_ROW_HEIGHT});
`;

const GridRow = styled.div<{ length: number }>`
	grid-row: 1 / span ${(props) => props.length};

	&:not(:first-child) {
		border-left: 1px solid #f4f5f6;
	}
`;

const GantLine = styled.span<{ isFirst: boolean; isLast: boolean }>`
	padding: 4px 8px;
	border-radius: 24px;
	align-self: center;
	font-size: 14px;
	font-weight: bold;

	${(props) =>
		props.isFirst &&
		css`
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		`}
	${(props) =>
		props.isLast &&
		css`
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		`}
`;

export const GantChart = (): JSX.Element => {
	const [state, dispatch] = useContext(GantChartContext);
	const columns = useMemo(() => new Array(state.segments).fill(0), [state.segments]);
	const dates = useMemo(() => {
		return getDateSegments(state.type, state.segments, state.date);
	}, [state.date, state.type, state.segments]);

	return (
		<>
			<GridItem colStart={2} rowStart={1}>
				<ClearGrid segments={state.segments}>
					<div className="arrow ar-l">
						<IconButton
							aria-label={'previous'}
							colorScheme={'gray'}
							variant={'ghost'}
							icon={<Chevron direction={'left'} />}
							onClick={() => dispatch({ type: 'DecreaseOffset' })}
						/>
					</div>
					<div className="arrow ar-r">
						<IconButton
							aria-label={'next'}
							colorScheme={'gray'}
							variant={'ghost'}
							icon={<Chevron direction={'right'} />}
							onClick={() => dispatch({ type: 'IncreaseOffset' })}
						/>
					</div>
					{dates.map((d, index) => (
						<div key={index}>
							<Text textAlign={'center'} fontSize={'sm'} color={'black'}>
								{d.title}
							</Text>
							<Text textAlign={'center'} fontSize={'xs'}>
								{d.subtitle}
							</Text>
						</div>
					))}
				</ClearGrid>
			</GridItem>
			<GridItem colStart={2} rowStart={2}>
				<GantGrid segments={state.segments} milestones={state.project?.tasks.length || 1}>
					{columns.map((s, index) => (
						<GridRow
							key={index}
							length={state.project?.tasks.length || 1}
							style={{ gridColumn: index + 1 }}
						/>
					))}
					{state.project?.tasks.map((task, index) => {
						const colors = colorGenerator(task.text);

						return (
							<GantLine
								key={index}
								isFirst={true}
								isLast={false}
								style={{
									gridColumn: '1 / span 4',
									gridRow: `${index + 1}`,
									backgroundColor: colors.backgroundColor
								}}
							>
								<Text isTruncated color={colors.textColor}>
									{task.text}
								</Text>
							</GantLine>
						);
					})}
				</GantGrid>
			</GridItem>
		</>
	);
};
