import { Layout } from './components/layout';
import { Hero } from './components/hero';
import { LogoCloud } from './components/logo-cloud';
import { Overview } from './components/overview';
import { Cta } from './components/cta';
import { Testimonials } from './components/testimonials';

function App() {
	return (
		<>
			<Layout>
				<Hero />
				<LogoCloud />
				<Overview />
				<Cta />
				<Testimonials />
			</Layout>
		</>
	);
}

export default App;
