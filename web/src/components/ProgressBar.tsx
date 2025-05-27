// import styled from 'styled-components'; // Removed styled-components
import { Box, Progress as ChakraProgress, Text } from '@chakra-ui/react'; // Added Chakra components

interface ProgressBarProps {
	percent: number; // Represents the "done" part
	secondaryProgress?: number; // Represents the "in progress" part, additional to "done"
}

// const ProgressBarStyled = styled.div<ProgressBarProps>` ... ` // Removed styled-component

export const ProgressBar = ({ percent, secondaryProgress = 0 }: ProgressBarProps): JSX.Element => {
	const totalProgress = percent + secondaryProgress;
	// Ensure values are within 0-100 for Progress component
	const clampedPercent = Math.max(0, Math.min(percent, 100));
	const clampedSecondaryProgress = Math.max(0, Math.min(secondaryProgress, 100 - clampedPercent));
	const clampedTotalProgress = Math.max(0, Math.min(totalProgress, 100));

	return (
		<Box width="100%">
			<Text fontSize="11px" textAlign="right">
				{clampedSecondaryProgress > 0 && (
					<>
						{clampedSecondaryProgress.toFixed(0)}% In progress{' '}
						<Text as="span" color="#f9dc97">
							{' '}
							{/* Directly using the color from original .in-progress */}
							&bull;
						</Text>{' '}
					</>
				)}
				{clampedPercent.toFixed(0)}% Done
			</Text>
			<Box
				my="6px"
				bg="#e9e9ef"
				height="6px"
				borderRadius="3px"
				overflow="hidden"
				position="relative"
			>
				{/* Base layer for total progress (done + in progress), effectively the in-progress part if secondary exists */}
				<ChakraProgress
					value={clampedTotalProgress}
					colorScheme="yellow" // Corresponds to #f9dc97 for .in-progress
					height="100%"
					borderRadius="3px"
					position="absolute"
					top={0}
					left={0}
					width="100%" // The progress bar itself will be sized by its value prop
					transition="width 0.2s linear"
					hasStripe={false} // Optional: if you want stripes for in-progress
					isAnimated={false} // Optional
				/>
				{/* Top layer for done progress */}
				<ChakraProgress
					value={clampedPercent}
					colorScheme="green" // Corresponds to #1fdf83 for .progress
					height="100%"
					borderRadius="3px"
					position="absolute"
					top={0}
					left={0}
					width="100%" // The progress bar itself will be sized by its value prop
					transition="width 0.2s linear"
				/>
			</Box>
		</Box>
	);
};
