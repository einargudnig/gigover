import { Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { GantChartContext } from '../contexts/GantChartContext';
import { getMinMaxForCalendarType } from '../hooks/useGantChart';

const DaySliderContainer = styled.div`
	position: fixed;
	bottom: 24px;
	right: 24px;
	background: #fff;
	box-shadow: 0 0 1px 1px #f2f4f7;
	user-select: none;
	padding: ${(props) => props.theme.padding(1, 2)};
	border-radius: 4px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const DateAmountSlider = (): JSX.Element => {
	const [state, dispatch] = useContext(GantChartContext);
	const [displayValue, setDisplayValue] = useState(state.segments);
	const minMax = useMemo(() => getMinMaxForCalendarType(state.type), [state.type]);

	useEffect(() => {
		if (state.segments !== displayValue) {
			setDisplayValue(state.segments);
		}

		// DO NOT LISTEN TO DISPLAY VALUE
		// IT WILL ALWAYS BE DIFFERENT UNTIL SEGMENTS HAS BEEN UPDATED
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.segments]);

	return (
		<DaySliderContainer>
			<Box width={'100px'} mr={6}>
				<Slider
					aria-label="damount-slider"
					min={minMax.min}
					max={minMax.max}
					defaultValue={minMax.defaultValue}
					colorScheme={'yellow'}
					onChange={(value) => setDisplayValue(value)}
					onChangeEnd={(value) => {
						if (value !== state.segments) {
							dispatch({ type: 'SetSegments', payload: value });
						}
					}}
				>
					<SliderTrack>
						<SliderFilledTrack />
					</SliderTrack>
					<SliderThumb />
				</Slider>
			</Box>
			<Box width={'70px'} style={{ textAlign: 'right' }}>
				<Text fontSize={'sm'}>
					{displayValue} {state.type.toLowerCase()}
				</Text>
			</Box>
		</DaySliderContainer>
	);
};
