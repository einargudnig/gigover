import { Box } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { Cta } from '../components/cta';
import { Hero } from '../components/hero';
// import { LogoCloud } from '../components/logo-cloud';
import { Overview } from '../components/overview';
import { Testimonials } from '../components/testimonials';
import { usePage } from '../queries/usePage';

export const Landing = () => {
	const variable = {
		slug: 'index'
	};
	const { data } = usePage(variable);

	const heroData = data?.page.pageBlocks[0];
	const testimonialsData = data?.page.pageBlocks[4];
	return (
		<>
			<Helmet>
				<title>Gigover | Construction made easy</title>
				<link rel="canonical" href="https://www.gigover.com/" />
			</Helmet>
			<Box marginTop={10}>
				<Hero data={heroData} />
				{/* <LogoCloud /> */}
				<Overview />
				<Cta />
				<Testimonials data={testimonialsData} />
			</Box>
		</>
	);
};
