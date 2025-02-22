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
import { CreateTender } from './Tender-Create-Steps/CreateTender';
import { AddItems } from './Tender-Create-Steps/AddItems';
import { PublishTender } from './Tender-Create-Steps/PublishTender';
import { AddBidder } from './Tender-Create-Steps/AddBidder';

const steps = [
	{ title: 'Create tender', description: 'Create tender' },
	{ title: 'Add items', description: 'Add items' },
	{ title: 'Publish tender', description: 'Publish tender' },
	{ title: 'Add bidder', description: 'Add bidders' }
];

export function NewTenderCreate() {
	const [tenderId, setTenderId] = useState<number | null>(null);
	const [activeStep, setActiveStep] = useState(0);

	const nextStep = () => {
		setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
	};

	const prevStep = () => {
		setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
	};

	// Component to render for each step
	const StepContent = ({ step }: { step: number }) => {
		switch (step) {
			case 0:
				return (
					<CreateTender
						onTenderCreate={(newTenderId: number) => {
							setTenderId(newTenderId);
							nextStep();
						}}
					/>
				);
			case 1:
				return tenderId ? (
					<AddItems
						tenderId={tenderId}
						onItemsAdded={() => {
							nextStep();
						}}
					/>
				) : null;
			case 2:
				return tenderId ? (
					<PublishTender
						tenderId={tenderId}
						onPublish={() => {
							nextStep();
						}}
					/>
				) : null;
			case 3:
				return tenderId ? (
					<AddBidder
						tenderId={tenderId}
						onBidderAdded={() => {
							// Maybe navigate away or show success message
						}}
					/>
				) : null;
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
			<Flex mt={8} justify="space-between">
				<Button
					onClick={prevStep}
					isDisabled={activeStep === 0}
					variant="outline"
					colorScheme="blackAlpha"
				>
					Previous
				</Button>
				<Button
					onClick={nextStep}
					isDisabled={activeStep === steps.length - 1 || !tenderId}
					variant="outline"
					colorScheme="blackAlpha"
				>
					Next
				</Button>
			</Flex>
		</Box>
	);
}
