import { useCallback } from 'react';
import {
	Box,
	Button,
	Icon,
	IconButton,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	PopoverArrow,
	PopoverCloseButton,
	Stack,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { ChatIcon, WarningIcon } from '@chakra-ui/icons';
import * as Sentry from '@sentry/react';
import { openUserFeedback } from '../sentry';

declare global {
	interface Window {
		Intercom?: (...args: any[]) => void;
		Sentry?: any;
	}
}

export function SupportLauncher() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const openIntercom = useCallback(() => {
		onClose();
		window.Intercom?.('show'); // relies on your existing Intercom boot
	}, [onClose]);

	const openSentry = useCallback(() => {
		onClose();

		const ok = openUserFeedback();
		if (!ok) {
			console.warn(
				'Sentry Feedback not available. Ensure Sentry.init ran and feedbackIntegration is added.'
			);
		}
	}, [onClose]);

	return (
		<Box position="fixed" right="16px" bottom="16px" zIndex={2147483000}>
			<Popover
				isOpen={isOpen}
				onOpen={onOpen}
				onClose={onClose}
				placement="top-end"
				closeOnBlur
			>
				<PopoverTrigger>
					<IconButton
						aria-label="Open support menu"
						borderRadius="full"
						size="lg"
						colorScheme="gray"
						icon={
							<Icon viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm1 15h-2v-2h2Zm2.07-7.75-.9.92A3.49 3.49 0 0 0 13 13h-2v-.5a4.5 4.5 0 0 1 1.33-3.17l1.24-1.26a1.94 1.94 0 0 0 .43-2A2 2 0 0 0 11 5a2.5 2.5 0 0 0-2.5 2.5H6A4 4 0 0 1 10 4a4 4 0 0 1 3.07 6.25Z"
								/>
							</Icon>
						}
						boxShadow="lg"
					/>
				</PopoverTrigger>
				<PopoverContent w="260px" _focus={{ boxShadow: 'lg' }}>
					<PopoverArrow />
					<PopoverCloseButton />
					<PopoverBody p={2}>
						<Stack spacing={1}>
							<Button
								onClick={openIntercom}
								justifyContent="flex-start"
								leftIcon={<ChatIcon />}
								variant="ghost"
							>
								<Text>Chat with us</Text>
							</Button>
							<Button
								onClick={openSentry}
								justifyContent="flex-start"
								leftIcon={<WarningIcon />}
								variant="ghost"
							>
								<Text>Report a bug</Text>
							</Button>
						</Stack>
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</Box>
	);
}
