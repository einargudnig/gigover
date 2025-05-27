import { Box, Select, Text, useTheme } from '@chakra-ui/react';
import { darken } from 'polished';
import { CaretIcon } from './icons/CaretIcon';

interface Option {
	value: number | string;
	label: string;
}

interface TrackerSelectProps {
	title: string;
	value?: number | string;
	options: Option[];
	valueChanged: (newValue: number | string) => void;
	disabled?: boolean;
	isNumber?: boolean;
	minWidth?: number;
	placeholder?: string;
	margin?: number;
}

export const TrackerSelect = ({
	placeholder = 'Click to select',
	title,
	value,
	options,
	valueChanged,
	minWidth,
	disabled = false,
	isNumber = true,
	margin = 1
}: TrackerSelectProps): JSX.Element => {
	const theme = useTheme();
	const grayBackground = theme.colors.gray[100]; // Or your specific gray

	return (
		<Box
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			background={grayBackground}
			padding="12px"
			marginY={`${margin * 8}px`}
			cursor="pointer"
			userSelect="none"
			transition="all 0.2s linear"
			borderRadius="6px"
			position="relative"
			minWidth={minWidth ? `${minWidth}px` : undefined}
			_hover={{
				backgroundColor: darken(0.05, grayBackground)
			}}
		>
			<Select
				disabled={disabled}
				defaultValue={`${value !== undefined ? value : ''}`}
				onChange={(event) =>
					valueChanged(isNumber ? parseInt(event.target.value) : event.target.value)
				}
				outline="none"
				border="none"
				background="transparent"
				position="absolute"
				width="100%"
				height="100%"
				top="0"
				left="0"
				padding="34px 16px 16px 16px"
				color="#838894"
				appearance="none"
				placeholder={placeholder}
				_disabled={{ cursor: 'not-allowed' }}
				sx={{
					'::-ms-expand': {
						display: 'none'
					}
				}}
			>
				<option value="">{placeholder}</option>
				{options?.map((option, optionIndex) => (
					<option key={optionIndex} value={option.value}>
						{option.label}
					</option>
				))}
			</Select>
			<Box>
				<Text as="small">{title}</Text>
				<Text as="p">&nbsp;</Text>
			</Box>
			<CaretIcon />
		</Box>
	);
};
