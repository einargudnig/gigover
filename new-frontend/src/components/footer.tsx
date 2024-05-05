import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Logo } from './logo';
import { FacebookIcon } from './icons/facebook';
import { LinkedInIcon } from './icons/linkedin';
import { TwitterIcon } from './icons/twitter';
import { AppButtons } from './icons/app-buttons';

export const Footer = () => {
	return (
		<Box as="footer" marginTop={10} paddingY={8} paddingX={8} backgroundColor={'black'}>
			<Flex flexDirection={['column-reverse', 'row']} alignItems={'center'}>
				<Box marginTop={[6, 0]}>
					<Flex flexDirection={'column'} alignItems={'center'}>
						<Logo color={'white'} scale={0.8} />
						<Box marginTop={6}>
							<Flex justifyContent={'space-between'}>
								<Box padding={1}>
									<FacebookIcon />
								</Box>
								<Box padding={1}>
									<LinkedInIcon />
								</Box>
								<Box padding={1}>
									<TwitterIcon />
								</Box>
							</Flex>
						</Box>
						<Text color={'white'} marginTop={6}>
							© 2024 Gigover
						</Text>
					</Flex>
				</Box>
				<Spacer />
				<Box>
					<Flex flexDirection={'column'} alignItems={'center'}>
						<Flex>
							<Text fontSize="larger" color={'white'} marginRight={2}>
								<Link to="/features">Features</Link>
							</Text>
							<Text fontSize="larger" color={'white'} marginRight={2}>
								<Link to="pricing">Pricing</Link>
							</Text>
							<Text fontSize="larger" color={'white'}>
								<Link to="/blog">Blog</Link>
							</Text>
						</Flex>
						<Box marginTop={4}>
							<AppButtons />
						</Box>
					</Flex>
				</Box>
			</Flex>
		</Box>
	);
};
