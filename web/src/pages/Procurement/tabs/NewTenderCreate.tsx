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
import { Tender } from '../../../models/Tender';

const steps = [
	{ title: 'Create tender', description: 'Create tender' },
	{ title: 'Add items', description: 'Add items' },
	{ title: 'Publish tender', description: 'Publish tender' },
	{ title: 'Add bidder', description: 'Add bidders' }
];

export function NewTenderCreate() {
	const [tender, setTender] = useState<Tender | null>(null);
	const [activeStep, setActiveStep] = useState(0);
	console.log({ tender });

	const nextStep = () => {
		setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
	};

	const prevStep = () => {
		setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
	};

	// Component to render for each step
	const StepContent = ({ step }) => {
		switch (step) {
			case 0:
				return (
					<CreateTender
						onTenderCreate={(newTender) => {
							setTender(newTender);
							nextStep();
						}}
					/>
				);
			case 1:
				return (
					<AddItems
						tender={tender}
						// onItemsAdded={(updatedTender) => {
						// 	setTender(updatedTender);
						// 	nextStep();
						// }}
					/>
				);
			case 2:
				return (
					<PublishTender
						tender={tender}
						// onPublish={(publishedTender) => {
						// 	setTender(publishedTender);
						// 	nextStep();
						// }}
					/>
				);
			case 3:
				return (
					<AddBidder
						tenderId={tender?.tenderId}
						// onBidderAdded={(finalTender) => {
						// 	setTender(finalTender);
						// }}
					/>
				);
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
					isDisabled={activeStep === steps.length - 1 || !tender}
					variant="outline"
					colorScheme="blackAlpha"
				>
					Next
				</Button>
			</Flex>
		</Box>
	);
}

const tender = {
	tenderId: 12345,
	projectId: 789,
	projectName: 'Office Building Renovation',
	taskId: 456,
	description: 'Complete renovation of 3rd floor office space',
	terms: 'Payment within 30 days after completion',
	finishDate: 1740374400000,
	delivery: 90,
	address: 'Laugavegur 123, 101 Reykjavík',
	status: 1,
	phoneNumber: '+354 555 1234',
	offerNote: 'Please include detailed timeline',
	bidStatus: 0,
	email: 'project@company.is',
	items: [
		{
			tenderId: 12345,
			tenderItemId: 1,
			nr: 101,
			description: 'Wall painting',
			volume: 250.5,
			unit: 'm²',
			cost: 1500000,
			notes: 'Premium quality paint required'
		},
		{
			tenderId: 12345,
			tenderItemId: 2,
			nr: 102,
			description: 'Flooring installation',
			volume: 180,
			unit: 'm²',
			cost: 2800000
		}
	],
	bidders: [],
	documents: [
		{
			id: 1,
			offerId: 5001,
			tenderId: 12345,
			name: 'floor-plan.pdf',
			type: 'DOCUMENT',
			url: 'https://example.com/documents/floor-plan.pdf',
			bytes: 2048576,
			created: 1708272000000
		},
		{
			id: 2,
			offerId: 5001,
			tenderId: 12345,
			name: 'site-photo.jpg',
			type: 'IMAGE',
			url: 'https://example.com/documents/site-photo.jpg',
			bytes: 1048576,
			created: 1708272000000
		}
	]
};
