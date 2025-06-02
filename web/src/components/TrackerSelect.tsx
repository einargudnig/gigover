import { Box, Select, Text } from '@chakra-ui/react';

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
	return (
		<Box
			cursor="pointer"
			paddingTop={8}
			userSelect="none"
			transition="all 0.2s linear"
			borderRadius="6px"
			minWidth={minWidth ? `${minWidth}px` : undefined}
		>
			<Box>
				<Text as="small">{title}</Text>
			</Box>
			<Select
				disabled={disabled}
				defaultValue={`${value !== undefined ? value : ''}`}
				onChange={(event) =>
					valueChanged(isNumber ? parseInt(event.target.value) : event.target.value)
				}
				background="gray.200"
				size="lg"
				width="100%"
				height="100%"
				placeholder={placeholder}
				_disabled={{ cursor: 'not-allowed' }}
			>
				{options?.map((option, optionIndex) => (
					<option key={optionIndex} value={option.value}>
						{option.label}
					</option>
				))}
			</Select>
		</Box>
	);
};
