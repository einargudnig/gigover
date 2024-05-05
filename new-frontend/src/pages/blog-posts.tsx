import { Link } from 'react-router-dom';
import { HStack, Text, Image, Container, Heading, Box } from '@chakra-ui/react';
import { Blog, useBlogPosts } from '../queries/useBlogPosts';
import { Center } from '../components/center';
import { LoadingSpinner } from '../components/loading-spinner';

export const BlogPosts = (): JSX.Element => {
	const { data: blog, isLoading } = useBlogPosts();
	console.log({ blog });
	return (
		<>
			<Heading as="h1">Blog</Heading>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<Container maxW={'7xl'} p="12">
					{blog?.blogs.map((b: Blog) => (
						<div key={b.id}>
							<Link to={`/blog/${b.id}/${b.slug}`}>
								<Box
									marginTop={{ base: '1', sm: '5' }}
									display="flex"
									flexDirection={{ base: 'column', sm: 'row' }}
									justifyContent="space-between"
								>
									<Box
										display="flex"
										flex="1"
										marginRight="3"
										position="relative"
										alignItems="center"
									>
										<Box
											width={{ base: '100%', sm: '85%' }}
											zIndex="2"
											marginLeft={{ base: '0', sm: '5%' }}
											marginTop="5%"
										>
											<Image
												borderRadius="lg"
												src={b?.image.url}
												alt="some good alt text"
												objectFit="contain"
											/>
										</Box>
										<Box
											zIndex="1"
											width="100%"
											position="absolute"
											height="100%"
										>
											<Box
												backgroundSize="20px 20px"
												opacity="0.4"
												height="100%"
											/>
										</Box>
									</Box>
									<Box
										display="flex"
										flex="1"
										flexDirection="column"
										justifyContent="center"
										marginTop={{ base: '3', sm: '0' }}
									>
										<Heading marginTop="1">{b?.title}</Heading>
										<Text as="p" marginTop="2" fontSize="lg">
											{b?.content.text.substr(0, 250)}
										</Text>
										<BlogAuthor
											name="The Gigover team"
											date={new Date('2021-04-06T19:01:27Z')}
										/>
									</Box>
								</Box>
							</Link>
						</div>
					))}
				</Container>
			)}
		</>
	);
};

interface BlogAuthorProps {
	date: Date;
	name: string;
}

export const BlogAuthor: React.FC<BlogAuthorProps> = (props) => {
	return (
		<HStack marginTop="2" spacing="2" display="flex" alignItems="center">
			<Text fontWeight="medium">{props.name}</Text>
		</HStack>
	);
};
