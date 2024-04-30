import { Cta } from '../components/cta';
import { Hero } from '../components/hero';
import { LogoCloud } from '../components/logo-cloud';
import { Overview } from '../components/overview';
import { Testimonials } from '../components/testimonials';
import { usePage } from '../queries/usePage';

export const Landing = () => {
	const variable = {
		slug: 'index'
	};
	const { data } = usePage(variable);
	console.log({ data });

	const heroData = data?.page.pageBlocks[0];
	// const overviewData = data?.page.pageBlocks[1];
	const testimonialsData = data?.page.pageBlocks[4];
	return (
		<>
			<Hero data={heroData} />
			<LogoCloud />
			<Overview />
			<Cta />
			<Testimonials data={testimonialsData} />
		</>
	);
};
