import React from 'react';
import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Box,
	Button,
	HStack,
	VStack,
	Text,
	useDisclosure,
	Collapse
} from '@chakra-ui/react';
import { CloseIcon, RepeatIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import EnhancedErrorBoundary from './EnhancedErrorBoundary';
import { ErrorCategory } from '../../sentry';
import { FallbackProps } from './EnhancedErrorBoundary';

interface ModalErrorBoundaryProps {
	children: React.ReactNode;
	modalName?: string;
	onClose?: () => void;
	showErrorMessage?: boolean;
}

/**
 * Specialized fallback component for modal errors
 */
const ModalFallback: React.FC<FallbackProps & { onClose?: () => void }> = ({
	error,
	resetError,
	showFeedback,
	onClose
}) => {
	const { isOpen, onToggle } = useDisclosure();

	return (
		<Box p={4} width="100%">
			<Alert
				status="error"
				variant="solid"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				textAlign="center"
				borderRadius="md"
			>
				<AlertIcon boxSize="40px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					An error occurred in this modal
				</AlertTitle>
				<AlertDescription maxWidth="md">
					<Text fontSize="md" mb={4}>
						Something went wrong while loading this content. You can try again or close
						this modal.
					</Text>

					<HStack spacing={4} justify="center" mt={4}>
						<Button
							leftIcon={<RepeatIcon />}
							onClick={resetError}
							colorScheme="white"
							variant="outline"
						>
							Try Again
						</Button>

						{onClose && (
							<Button
								leftIcon={<CloseIcon />}
								onClick={onClose}
								colorScheme="white"
								variant="outline"
							>
								Close Modal
							</Button>
						)}
					</HStack>

					<Button
						size="sm"
						variant="link"
						onClick={onToggle}
						color="white"
						mt={4}
						rightIcon={isOpen ? undefined : <InfoOutlineIcon />}
					>
						{isOpen ? 'Hide Details' : 'Show Details'}
					</Button>

					<Collapse in={isOpen} animateOpacity>
						<Box
							mt={2}
							p={2}
							bg="whiteAlpha.200"
							borderRadius="md"
							fontSize="sm"
							textAlign="left"
							fontFamily="monospace"
							whiteSpace="pre-wrap"
						>
							{error?.message || 'Unknown error'}
						</Box>
					</Collapse>

					<VStack spacing={2} mt={4}>
						<Button size="sm" variant="link" colorScheme="white" onClick={showFeedback}>
							Report this issue
						</Button>
					</VStack>
				</AlertDescription>
			</Alert>
		</Box>
	);
};

/**
 * Error boundary specifically designed for modal components
 * Provides a compact, modal-appropriate error UI
 */
const ModalErrorBoundary: React.FC<ModalErrorBoundaryProps> = ({
	children,
	modalName = 'unnamed',
	onClose,
	showErrorMessage = false
}) => {
	return (
		<EnhancedErrorBoundary
			errorCategory={ErrorCategory.RENDER}
			name={`Modal:${modalName}`}
			fallback={(props) => <ModalFallback {...props} onClose={onClose} />}
			retryable={true}
			showDetails={showErrorMessage}
		>
			{children}
		</EnhancedErrorBoundary>
	);
};

export default ModalErrorBoundary;
