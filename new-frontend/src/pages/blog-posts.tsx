import { Link } from 'react-router-dom';
import { HStack, Text, Image, Container, Heading, Box } from '@chakra-ui/react';
import { Blog, useBlogPosts } from '../queries/useBlogPosts';
import { Center } from '../components/center';
import { LoadingSpinner } from '../components/loading-spinner';

export const BlogPosts = (): JSX.Element => {
	const { data: blog, isLoading, isError } = useBlogPosts();
	console.log({ blog });

	return (
		<>
			<Heading as="h1">Blog</Heading>
			{isLoading ? (
				<Box width="100%" height="100%">
					<Center>
						<LoadingSpinner />
					</Center>
				</Box>
			) : (
				<Container maxW={'7xl'} p="2">
					{isError ? (
						<Text>No blog post found!</Text>
					) : (
						<>
							{blog?.blogs.map((b: Blog) => (
								<Box
									key={b.id}
									as={Link}
									to={`/blog/${b.id}/${b.slug}`}
									_hover={{ textDecoration: 'none' }}
								>
									<Box
										mt={{ base: '1', sm: '5' }}
										display="flex"
										flexDir={{ base: 'column', sm: 'row' }}
										justifyContent="space-between"
										alignItems={'flex-start'}
									>
										<Box
											flex="1"
											mr="3"
											position="relative"
											alignItems="center"
										>
											<Box
												w={{ base: '100%', sm: '85%' }}
												zIndex="2"
												ml={{ base: '0', sm: '5%' }}
												mt="5%"
											>
												<Image
													borderRadius="lg"
													src={b?.image.url}
													alt={b.title || 'Image alt text'}
													objectFit="cover"
													h={['200px', '200px']}
													w={['400px', '450px']}
													transition="transform 0.2s"
													_hover={{ transform: 'scale(1.05)' }}
												/>
											</Box>
										</Box>
										<Box
											flex="1"
											flexDir="column"
											justifyContent="center"
											marginTop={[2, 10]}
										>
											<Heading mt="1" size="md">
												{b?.title}
											</Heading>
											<Text as="p" mt="2" fontSize="lg" noOfLines={3}>
												{b?.content.text?.substr(0, 250)}
											</Text>
											<BlogAuthor
												name="The Gigover team"
												date={new Date(b?.publishedAt)}
											/>
										</Box>
									</Box>
								</Box>
							))}
						</>
					)}
				</Container>
			)}
		</>
	);
};

interface BlogAuthorProps {
	date: Date;
	name: string;
}

export const BlogAuthor: React.FC<BlogAuthorProps> = ({ name, date }) => {
	return (
		<HStack mt="2" spacing="2" alignItems="center">
			<Text as="b">{name}</Text>
			<Text>—</Text>
			<Text>{date.toLocaleDateString()}</Text>
		</HStack>
	);
};
