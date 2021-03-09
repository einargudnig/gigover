import { GantChartReducer, InitialGantChartState } from '../hooks/useGantChart';
import { createContext } from 'react';

export const GantChartContext = createContext<GantChartReducer>([
	InitialGantChartState,
	() => InitialGantChartState
]);
