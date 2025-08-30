import { useCallback, useState } from 'react';
import {
	Box,
	Button,
	IconButton,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	PopoverArrow,
	Stack,
	Text,
	useDisclosure,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Select,
	Textarea,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	ModalFooter
} from '@chakra-ui/react';
import { ChatIcon, WarningIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import * as Sentry from '@sentry/react';

declare global {
	interface Window {
		Intercom?: (...args: any[]) => void;
		Sentry?: any;
	}
}

type FeedbackCategory = 'bug' | 'feature' | 'other';

export function SupportLauncher() {
	const pop = useDisclosure(); // Popover disclosure
	const feedback = useDisclosure(); // Modal disclosure

	const openIntercom = useCallback(() => {
		pop.onClose();
		window.Intercom?.('show'); // relies on your existing Intercom boot
	}, [pop]);

	const onReportBug = () => {
		pop.onClose();
		feedback.onOpen();
	};

	return (
		<>
			<Box position="fixed" right="16px" bottom="16px" zIndex={2147483000}>
				<Popover
					isOpen={pop.isOpen}
					onOpen={pop.onOpen}
					onClose={pop.onClose}
					placement="top-end"
					closeOnBlur
				>
					<PopoverTrigger>
						<IconButton
							aria-label="Open support menu"
							borderRadius="full"
							size="lg"
							colorScheme="gray"
							icon={<QuestionOutlineIcon />}
							boxShadow="lg"
						/>
					</PopoverTrigger>
					<PopoverContent w="260px" _focus={{ boxShadow: 'lg' }}>
						<PopoverArrow />
						<PopoverBody p={2}>
							<Stack spacing={1}>
								<Button
									onClick={openIntercom}
									colorScheme={'black'}
									justifyContent="flex-start"
									leftIcon={<ChatIcon color={'black'} />}
									variant="ghost"
								>
									<Text>Chat with us</Text>
								</Button>
								<Button
									onClick={onReportBug}
									colorScheme={'black'}
									justifyContent="flex-start"
									leftIcon={<WarningIcon color={'black'} />}
									variant="ghost"
								>
									<Text>Report a bug</Text>
								</Button>
							</Stack>
						</PopoverBody>
					</PopoverContent>
				</Popover>
			</Box>

			<Modal isOpen={feedback.isOpen} onClose={feedback.onClose} size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Report a bug</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<CustomFeedbackForm
							onSubmitted={feedback.onClose}
							onCancel={feedback.onClose}
						/>
					</ModalBody>
					<ModalFooter>
						{/* Optional footer actions; the form already has its own submit button */}
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

function CustomFeedbackForm({
	onSubmitted,
	onCancel
}: {
	onSubmitted?: () => void;
	onCancel?: () => void;
}) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [category, setCategory] = useState<FeedbackCategory>('bug');
	const [comments, setComments] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toast = useToast();

	const emailInvalid = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (emailInvalid || comments.trim().length === 0) {
			toast({
				title: 'Please fix form errors.',
				status: 'warning'
			});
			return;
		}

		setIsSubmitting(true);
		try {
			Sentry.addBreadcrumb({
				category: 'feedback',
				level: 'info',
				message: `User submitted feedback (${category})`
			});

			const feedbackApi = (Sentry as any).feedback;

			if (feedbackApi?.capture) {
				await feedbackApi.capture({
					name: name || undefined,
					email: email || undefined,
					message: comments,
					data: {
						category,
						route: window.location.pathname
					}
				});
			} else {
				// Legacy fallback: create a message event and attach feedback
				const eventId = Sentry.captureMessage('User feedback (custom form)');
				// Optional: add structured context/tags
				Sentry.setTag('feedback.category', category);
				await (Sentry as any).captureFeedback?.({
					event_id: eventId,
					name: name || undefined,
					email: email || undefined,
					comments
				});
			}

			toast({
				title: 'Thanks for your feedback!',
				status: 'success'
			});

			// Reset and close
			setName('');
			setEmail('');
			setComments('');
			setCategory('bug');

			onSubmitted?.();
		} catch (err) {
			console.error('Failed to send feedback', err);
			toast({
				title: 'Failed to send feedback',
				description: 'Please try again.',
				status: 'error'
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Box as="form" onSubmit={handleSubmit}>
			<Stack spacing={4}>
				<FormControl>
					<FormLabel>Name</FormLabel>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Your name"
					/>
				</FormControl>

				<FormControl isInvalid={emailInvalid}>
					<FormLabel>Email</FormLabel>
					<Input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
						type="email"
					/>
					<FormErrorMessage>Invalid email address.</FormErrorMessage>
				</FormControl>

				<FormControl>
					<FormLabel>Category</FormLabel>
					<Select
						value={category}
						onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
					>
						<option value="bug">Bug</option>
						<option value="feature">Feature request</option>
						<option value="other">Other</option>
					</Select>
				</FormControl>

				<FormControl isRequired>
					<FormLabel>What happened?</FormLabel>
					<Textarea
						value={comments}
						onChange={(e) => setComments(e.target.value)}
						placeholder="Describe the issue or feedback"
						minH="120px"
						borderColor="gray.150"
						borderWidth={1}
						rounded="md"
						p={2}
					/>
				</FormControl>

				<Stack direction="row" justify="flex-end" spacing={3}>
					<Button
						variant="outline"
						colorScheme="gray"
						onClick={onCancel}
						isDisabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="outline"
						colorScheme="black"
						isLoading={isSubmitting}
					>
						Send feedback
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}
