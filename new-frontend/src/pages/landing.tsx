import { Cta } from '../components/cta';
import { Hero } from '../components/hero';
import { LogoCloud } from '../components/logo-cloud';
import { Overview } from '../components/overview';
import { Testimonials } from '../components/testimonials';

export const Landing = () => {
	return (
		<>
			<Hero />
			<LogoCloud />
			<Overview />
			<Cta />
			<Testimonials />
		</>
	);
};
