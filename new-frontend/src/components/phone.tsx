import { Box, Image } from '@chakra-ui/react';

export const Phone = () => {
	return (
		<Box
			mx="auto"
			border="2px solid gray.800"
			bg="gray.800"
			borderWidth="14px"
			rounded="2.5rem"
			h="600px"
			w="300px"
			position="relative"
		>
			<Box
				h="32px"
				w="3px"
				bg="gray.800"
				dark={{ bg: 'gray.800' }}
				pos="absolute"
				left="-17px"
				top="72px"
				rounded="lg"
			></Box>
			<Box
				h="46px"
				w="3px"
				bg="gray.800"
				dark={{ bg: 'gray.800' }}
				pos="absolute"
				left="-17px"
				top="124px"
				rounded="lg"
			></Box>
			<Box
				h="46px"
				w="3px"
				bg="gray.800"
				dark={{ bg: 'gray.800' }}
				pos="absolute"
				left="-17px"
				top="178px"
				rounded="lg"
			></Box>
			<Box
				h="64px"
				w="3px"
				bg="gray.800"
				dark={{ bg: 'gray.800' }}
				pos="absolute"
				right="-17px"
				top="142px"
				roundedRight="lg"
			></Box>
			<Box
				overflow="hidden"
				w="272px"
				h="572px"
				bg="white"
				dark={{ bg: 'gray.800' }}
				rounded="xl"
			>
				<Image
					src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/mockup-1-light.png"
					className="dark:hidden"
					w="272px"
					h="572px"
					alt=""
				/>
				<Image
					src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/mockup-1-dark.png"
					className="hidden dark:block"
					w="272px"
					h="572px"
					alt=""
				/>
			</Box>
		</Box>
	);
};
