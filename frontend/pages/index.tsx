import React from 'react';
import { HeadTitle } from '../components/HeadTitle';
import { PageBlock } from '../components/PageContainer';

const Index = (props): JSX.Element => {
	console.log('IndexPageProps', props);
	const TagLine = 'Project management made easy';

	return (
		<>
			<HeadTitle title={TagLine} />
			<PageBlock color={'black'}>
				<h1>{TagLine}</h1>
				<p>Imagine knowing the status of each portion of a construction project while eliminating downtime and wasted materials. Gigover allows you to create projects, assign tasks seamlessly, keep track of what needs to be done versus what’s completed. </p>
				<button>Sign up</button>
				<button>View features</button>
			</PageBlock>
			<PageBlock color={'white'}>
				<h1>See Gigover in action</h1>
				<video>Video here</video>
			</PageBlock>
			<PageBlock color={'gray'}>
				<div>Images</div>
				<div>
					<label>Features</label>
					<h1>Gigover is with you at work, in your pockets and where ever you go.</h1>
					<p>
						With our software solutions you can have Gigover with you at all times.
						Being available both in your Desktop and Smart phone can be crucial for your
						business. We have all of our features available in both platforms to make
						sure you can work on the go.
					</p>
					<button>Get started</button>
				</div>
			</PageBlock>
			<PageBlock color={'white'}>
				<h1>Track every project and turn your business around</h1>
				<p>Download the app today on the app stores</p>
				<a href="/">Download iOS</a>
				<a href="/">Download Android</a>
			</PageBlock>
			<PageBlock color={'yellow'}>
				<p>
					“Gigover provides the ability to work on a task list at the smallest level where
					I can check things off, all the way up to tracking my entire compani’s
					engineering velocity at the milestone level.”
				</p>
				<h4>Sigrun Jameson CTO and Co-Founder</h4>
				<h5>BigMachines Inc.</h5>
			</PageBlock>
		</>
	);
};

export default Index;
