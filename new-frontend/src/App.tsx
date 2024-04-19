import styled from 'styled-components';
import { Navbar } from './components/navbar';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	grid-gap: 20px;
	margin: 0 36px;
	max-width: 1440px;

	@media (max-width: 768px) {
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 16px;
		margin: 0 12px;
		max-width: 390px;
	}
`;

function App() {
	return (
		<>
			<Navbar />
			<Grid>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>

				<h1>Vite + React</h1>
				<div className="card">
					<p>
						Edit <code>src/App.tsx</code> and save to test HMR
					</p>
				</div>
				<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
			</Grid>
		</>
	);
}

export default App;
