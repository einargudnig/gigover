import { Box, Image } from '@chakra-ui/react';

export const Computer = () => {
	return (
		<>
			<Box
				mx="auto"
				border="2px solid gray.800"
				bg="gray.800"
				borderWidth="16px"
				borderTopRadius="xl"
				h="172px"
				maxW="301px"
				md={{ h: '294px', maxW: '512px' }}
			>
				<Box overflow="hidden" h="140px" md={{ h: '262px' }} rounded="xl">
					<Image
						src="https://flowbite.s3.amazonaws.com/docs/device-mockups/screen-image-imac.png"
						className="dark:hidden"
						h="140px"
						w="full"
						rounded="xl"
						alt=""
					/>
					<Image
						src="https://flowbite.s3.amazonaws.com/docs/device-mockups/screen-image-imac-dark.png"
						className="hidden dark:block"
						h="140px"
						w="full"
						rounded="xl"
						alt=""
					/>
				</Box>
			</Box>
			<Box
				mx="auto"
				bg="gray.900"
				dark={{ bg: 'gray.700' }}
				borderBottomRadius="xl"
				h="24px"
				maxW="301px"
				md={{ h: '42px', maxW: '512px' }}
			></Box>
			<Box
				mx="auto"
				bg="gray.800"
				borderBottomRadius="xl"
				h="55px"
				maxW="83px"
				md={{ h: '95px', maxW: '142px' }}
			></Box>
		</>
	);
};
