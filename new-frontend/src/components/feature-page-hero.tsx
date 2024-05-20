import { Box, Flex, Heading, Text, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import hero from '/hero1.png';

export const FeaturePageHero = () => {
	return (
		<Box paddingX={['10px', 0]} paddingLeft={[0, '165px']} marginTop={10}>
			<Flex flexDirection={['column', 'row']}>
				<Box width={['100%', '40%']} textAlign={['center', 'left']}>
					<Heading fontSize={'40px'} marginBottom={'24px'}>
						Managing your work has never been easier, faster or more efficient
					</Heading>
					<Text fontSize={'24px'} marginBottom={'40px'}>
						Simplify your project management with Gigover. Streamline your process and
						ensure efficient execution.
					</Text>
					<Button>
						<Link to="https://web.gigover.com/">Start free trial</Link>
					</Button>
				</Box>

				<Box>
					<Image
						src={hero}
						alt="Project dashboard"
						width={['400px', '610px']}
						height={['200px', '379px']}
						rounded={'md'}
					/>
				</Box>
			</Flex>
		</Box>
	);
};
