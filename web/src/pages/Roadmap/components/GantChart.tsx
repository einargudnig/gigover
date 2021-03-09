import { Box } from '@chakra-ui/react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { GantChartContext } from '../contexts/GantChartContext';

interface GridProps {
	segments: number;
}

const ClearGrid = styled.div<GridProps>`
	display: grid;
	border: 0;
	overflow: hidden;
	box-sizing: border-box;
	grid-template-columns: repeat(${(props) => props.segments}, 1fr);
	grid-template-rows: 40px;
	grid-gap: 0;
`;

const GantGrid = styled(ClearGrid)<GridProps>`
	border-radius: 12px;
	border: 1px solid #eee;

	> div {
		border-top: 1px solid #dfdfdf;
		border-left: 1px solid #dfdfdf;
	}
`;

export const GantChart = (): JSX.Element => {
	const [state] = useContext(GantChartContext);
	const columns = new Array(state.segments).fill(0);

	return (
		<Box flexGrow={1} ml={8}>
			<ClearGrid segments={state.segments}>
				<div>1 Tue</div>
				<div>2 Wed</div>
				<div>3 Thu</div>
				<div>4 Fri</div>
			</ClearGrid>
			<GantGrid segments={state.segments}>
				{columns.map((s, index) => (
					<div key={index} />
				))}
			</GantGrid>
		</Box>
	);
};
