import { Layout } from './components/layout';
import { Hero } from './components/hero';
import { LogoCloud } from './components/logo-cloud';
import { Overview } from './components/overview';

function App() {
	return (
		<>
			<Layout>
				<Hero />
				<LogoCloud />
				<Overview />
			</Layout>
		</>
	);
}

export default App;
