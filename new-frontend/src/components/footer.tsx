import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Logo } from './logo';
import { FacebookIcon } from './icons/facebook';
import { LinkedInIcon } from './icons/linkedin';
import { TwitterIcon } from './icons/twitter';
import { NewAppButtons } from './icons/new-app-buttons';

export const Footer = () => {
	return (
		<Box as="footer" paddingY={8} paddingX={['10px', '165px']} backgroundColor={'black'}>
			<Flex flexDirection={['column-reverse', 'row']} alignItems={'center'}>
				<Box marginTop={[6, 0]}>
					<Flex flexDirection={'column'} alignItems={'center'}>
						<Logo color={'white'} scale={0.7} />
						<Box marginTop={6}>
							<Flex justifyContent={'space-between'} alignItems={'center'}>
								<Box paddingRight={2}>
									<Link to="https://www.facebook.com/profile.php?id=100063635606744">
										<FacebookIcon />
									</Link>
								</Box>
								<Box paddingX={2}>
									<Link to="https://www.linkedin.com/company/gigover/">
										<LinkedInIcon />
									</Link>
								</Box>
								<Box paddingLeft={3}>
									<Link to="https://x.com/GigOver">
										<TwitterIcon />
									</Link>
								</Box>
							</Flex>
						</Box>
						<Text color={'white'} marginTop={6} fontSize={'14px'}>
							© 2024 Gigover
						</Text>
					</Flex>
				</Box>
				<Spacer />
				<Box>
					<Flex flexDirection={'column'} alignItems={'flex-start'}>
						<Flex justifyContent={'space-between'} width="full">
							<Text
								fontSize={'14px'}
								color={'white'}
								marginRight={2}
								alignSelf={'flex-start'}
							>
								<Link to="/features">Features</Link>
							</Text>
							<Text fontSize={'14px'} color={'white'} marginRight={2}>
								<Link to="pricing">Pricing</Link>
							</Text>
							<Text fontSize={'14px'} color={'white'} alignSelf={'flex-end'}>
								<Link to="/blog">Blog</Link>
							</Text>
						</Flex>
						<Box marginTop={'31px'}>
							<NewAppButtons />
						</Box>
					</Flex>
				</Box>
			</Flex>
		</Box>
	);
};
