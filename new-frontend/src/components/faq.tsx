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
		answer: 'Gigover simplifies project management by helping managers streamline projects and guide them towards goals and task completion. Gigover is for everybody that is involved in projects.'
	},
	{
		id: 2,
		question: 'How can Gigover help my business?',
		answer: 'Gigover enhances project management by increasing the likelihood that projects of all sizes stay on budget and on schedule. The final result will meet all stakeholders standards. You can set a budget for a project and track all costs during the budget period. Gigover’s procurement feature helps you get the best prices from vendors and track what is needed for each project. You can register all resources, track maintenance requirements, and monitor the status of warranties.'
	},
	{
		id: 3,
		question: 'Why should I choose Gigover?',
		answer: 'Gigover provides all the tools you need to run a successful project. You can start for free to see if Gigover is the right software partner for you and then expand by adding more users to your account.'
	},
	{
		id: 4,
		question: 'How do I get started?',
		answer: 'Click the sign-up button to begin the registration process, which takes less than a minute. Start with the free plan to test Gigover, with the option to add more units at any time.'
	},
	{
		id: 6,
		question: 'Is there a free trial?',
		answer: 'Yes, you can sign up and try Gigover for free.'
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
