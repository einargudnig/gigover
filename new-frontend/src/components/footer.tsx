import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { Logo } from './logo';
import { FacebookIcon } from './icons/facebook';
import { LinkedInIcon } from './icons/linkedin';
import { TwitterIcon } from './icons/twitter';
import { AppButtons } from './icons/app-buttons';

export const Footer = () => {
	return (
		<Box marginTop={10} paddingY={8} paddingX={'36px'} backgroundColor={'black'}>
			<Grid templateColumns="repeat(6, 1fr)" gap={6}>
				<GridItem colSpan={2}>
					<Flex flexDirection={'column'} alignItems={'start'}>
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
				</GridItem>
				<GridItem colSpan={2}>
					{/* <Flex flexDirection={'column'} alignItems={'center'}>
						<Text color={'white'}>About</Text>
						<Text color={'white'}>Contact</Text>
						<Text color={'white'}>Careers</Text>
					</Flex> */}
				</GridItem>
				<GridItem colSpan={2}>
					<Flex flexDirection={'column'} alignItems={'end'}>
						<Flex>
							<Text fontSize="larger" color={'white'} marginRight={2}>
								Features
							</Text>
							<Text fontSize="larger" color={'white'} marginRight={2}>
								Pricing
							</Text>
							<Text fontSize="larger" color={'white'}>
								Blog
							</Text>
						</Flex>
						<Box marginTop={4}>
							<AppButtons />
						</Box>
					</Flex>
				</GridItem>
			</Grid>
		</Box>
	);
};
