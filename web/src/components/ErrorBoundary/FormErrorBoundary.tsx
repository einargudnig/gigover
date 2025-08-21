import React from 'react';
import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Box,
	Button,
	Card,
	CardBody,
	Divider,
	Text
} from '@chakra-ui/react';
import { RepeatIcon, WarningIcon } from '@chakra-ui/icons';
import EnhancedErrorBoundary from './EnhancedErrorBoundary';
import { ErrorCategory } from '../../sentry';
import { FallbackProps } from './EnhancedErrorBoundary';

interface FormErrorBoundaryProps {
	children: React.ReactNode;
	formName?: string;
	onReset?: () => void;
	preserveFormData?: boolean;
	allowSubmitOnError?: boolean;
	showDetailsOnError?: boolean;
}

/**
 * Specialized fallback for form errors that preserves form context
 */
const FormErrorFallback: React.FC<
	FallbackProps & {
		formName?: string;
		onReset?: () => void;
		preserveFormData?: boolean;
	}
> = ({ error, resetError, formName = 'form', onReset, preserveFormData = true }) => {
	// Handle form reset, optionally preserving form data
	const handleReset = () => {
		resetError();
		if (onReset && !preserveFormData) {
			onReset();
		}
	};

	return (
		<Card variant="outline" borderColor="red.200" bg="red.50" my={4}>
			<CardBody>
				<Alert status="error" variant="subtle" borderRadius="md">
					<AlertIcon as={WarningIcon} />
					<Box>
						<AlertTitle>Form Error</AlertTitle>
						<AlertDescription>
							There was a problem with the {formName}.
						</AlertDescription>
					</Box>
				</Alert>

				<Divider my={3} />

				<Text fontSize="sm" mb={4}>
					{error?.message || 'An unexpected error occurred while rendering this form.'}
					{preserveFormData ? ' Your form data has been preserved.' : ''}
				</Text>

				<Button
					leftIcon={<RepeatIcon />}
					onClick={handleReset}
					colorScheme="red"
					size="sm"
					variant="outline"
				>
					Reload Form{preserveFormData ? ' (Keep Data)' : ''}
				</Button>
			</CardBody>
		</Card>
	);
};

/**
 * Error boundary specifically designed for forms
 * Preserves form data across errors and provides context-appropriate UI
 */
const FormErrorBoundary: React.FC<FormErrorBoundaryProps> = ({
	children,
	formName = 'form',
	onReset,
	preserveFormData = true,
	allowSubmitOnError = false,
	showDetailsOnError = false
}) => {
	return (
		<EnhancedErrorBoundary
			errorCategory={ErrorCategory.RENDER}
			name={`Form:${formName}`}
			fallback={(props) => (
				<FormErrorFallback
					{...props}
					formName={formName}
					onReset={onReset}
					preserveFormData={preserveFormData}
				/>
			)}
			retryable={true}
			showDetails={showDetailsOnError}
		>
			{children}
		</EnhancedErrorBoundary>
	);
};

export default FormErrorBoundary;
