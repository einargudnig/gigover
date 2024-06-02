import * as React from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Heading,
	Box,
	Text
} from '@chakra-ui/react';

interface FaqItem {
	id: number;
	question: string;
	answer: string;
}

const faqData: FaqItem[] = [
	{
		id: 1,
		question: 'Who is Gigover for?',
		answer: 'Gigover simplifies project management for property management by helping managers streamline projects and guide them towards goals and task completion. All stakeholders involved with a property can benefit from using Gigover, including property owners, project managers, property managers, contractors, and tenants.'
	},
	{
		id: 2,
		question: 'How can Gigover help my business?',
		answer: 'Gigover enhances project management by increasing the likelihood that projects of all sizes stay on budget and on schedule. The final result will meet all stakeholders standards. You can set a budget for maintenance and track all costs during the budget period. By setting up a maintenance schedule, you can minimize costs and avoid expensive repairs due to inadequate maintenance. Gigover’s procurement feature helps you get the best prices from vendors and track what is needed for each project. You can register all resources, track maintenance requirements, and monitor the status of warranties.'
	},
	{
		id: 3,
		question: 'Why should I choose Gigover?',
		answer: 'Gigover provides all the tools you need to run a successful project. You can start for free to see if Gigover is the right software partner for you and then expand by adding more units to your account.'
	},
	{
		id: 4,
		question: 'How do I get started?',
		answer: 'Click the sign-up button to begin the registration process, which takes less than a minute. Start with the free plan to test Gigover, with the option to add more units at any time.'
	},
	{
		id: 5,
		question: 'What is a unit?',
		answer: `A unit can be a building, a floor within a building, or a single office. It can be an apartment building, apartments within an apartment building, common areas, or closed-off areas for the maintenance crew. A school can be a unit, and so can a single classroom. Retail space can be a unit, and it is possible to break it up into more units if needed. A park can be a unit and it can be broken up into more units if needed. A bridge can be a unit and so can a road. Contractors can create a unit, work on their project from start to finish, then transfer the unit to the buyer’s Gigover account and close the unit and project on their own account.
            Choose what best suits your project management and maintenance needs.`
	},
	{
		id: 6,
		question: 'Is there a free trial?',
		answer: 'Yes, you can sign up and try Gigover for free. You can remain on the free plan for as long as you like or add units to your account as needed.'
	}
];

export const FAQ: React.FC = () => {
	return (
		<Box marginTop={4}>
			<Heading as="h2" size="lg" textAlign="center" marginBottom={10}>
				FAQs
			</Heading>
			<Accordion allowToggle>
				{faqData.map((faq) => (
					<AccordionItem key={faq.id} borderColor={'black'}>
						<h2>
							<AccordionButton>
								<AccordionIcon />
								<Box flex="1" textAlign="left">
									<Text as="b">{faq.question}</Text>
								</Box>
							</AccordionButton>
						</h2>
						<AccordionPanel pb={4}>{faq.answer}</AccordionPanel>
					</AccordionItem>
				))}
			</Accordion>
		</Box>
	);
};
