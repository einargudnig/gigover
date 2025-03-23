import {
	Box,
	Button,
	Flex,
	Step,
	StepIcon,
	StepIndicator,
	StepNumber,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper
} from '@chakra-ui/react';
import { useState } from 'react';
import { AddItemsSingleBid } from './AddItemsSingleBid';
import { AddSingleBidder } from './AddSingleBidder';
import { CreateBidSingleBidder } from './CreateBidSingleBidder';
import { PublishSingleBid } from './PublishSingleBid';

const steps = [
	{ title: 'Invite client', description: 'Invite client' },
	{ title: 'Create bid', description: 'Create bid' },
	{ title: 'Add items', description: 'Add items' },
	{ title: 'Publish bid', description: 'Publish bid' }
];

export function CreateBidStepper({
	setShowCreateBid
}: {
	setShowCreateBid: (show: boolean) => void;
}) {
	const [clientUid, setClientUid] = useState<string | null>(null);
	const [bidId, setBidId] = useState<number | null>(null);
	const [activeStep, setActiveStep] = useState(0);

	const nextStep = () => {
		setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
	};

	const prevStep = () => {
		// eslint-disable-next-line no-shadow
		setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
	};

	// Component to render for each step
	const StepContent = ({ step }: { step: number }) => {
		switch (step) {
			case 0:
				return (
					<AddSingleBidder
						onClientInvite={(newClientId) => {
							setClientUid(newClientId);
							nextStep();
						}}
					/>
				);
			case 1:
				return (
					<CreateBidSingleBidder
						clientUId={clientUid}
						onBidCreate={(newBidId: number) => {
							setBidId(newBidId);
							nextStep();
						}}
					/>
				);
			case 2:
				return bidId ? (
					<AddItemsSingleBid
						bidId={bidId}
						onItemsAdded={() => {
							nextStep();
						}}
					/>
				) : null;
			case 3:
				return bidId ? <PublishSingleBid bidId={bidId} /> : null;
			default:
				return null;
		}
	};

	return (
		<Box width="100%" p={4}>
			<Stepper index={activeStep} mb={8} colorScheme="blackAlpha">
				{steps.map((step, index) => (
					<Step key={index}>
						<StepIndicator>
							<StepStatus
								// complete={index < activeStep}
								// active={index === activeStep}
								// incomplete={index > activeStep}
								complete={<StepIcon />}
								incomplete={<StepNumber />}
								active={<StepNumber />}
							/>
						</StepIndicator>

						<Box flexShrink="0">
							<StepTitle>{step.title}</StepTitle>
						</Box>

						<StepSeparator />
					</Step>
				))}
			</Stepper>

			{/* Render current step content */}
			<StepContent step={activeStep} />

			{/* Navigation buttons */}
			<Flex mt={8} mb={14} justify="space-between">
				<Button
					onClick={prevStep}
					isDisabled={activeStep === 0}
					variant="outline"
					colorScheme="blackAlpha"
				>
					Previous
				</Button>
				{activeStep <= 2 ? (
					<Button
						onClick={nextStep}
						isDisabled={activeStep === steps.length - 1 || activeStep === 1 || !bidId}
						variant="outline"
						colorScheme="blackAlpha"
					>
						Next
					</Button>
				) : null}
			</Flex>
		</Box>
	);
}
