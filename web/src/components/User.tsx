import { Box, Text, Avatar, Image } from '@chakra-ui/react';
import { useState } from 'react';

interface UserProps {
	avatar: string;
	name: string;
}

export const User = ({ avatar, name }: UserProps): JSX.Element => {
	const [isImageLoaded, setIsImageLoaded] = useState(true);
	// Extract the first letter of the user's name
	const nameInitial = name.charAt(0).toUpperCase();

	const handleImageError = () => {
		console.log('No avatar found, using fallback name initials');
		setIsImageLoaded(false);
	};

	return (
		<Box display="flex" alignItems="center" userSelect="none">
			{isImageLoaded ? (
				<Image
					src={avatar}
					alt={name}
					boxSize="36px"
					borderRadius="full"
					onError={handleImageError}
					marginRight={4}
					objectFit="cover"
				/>
			) : (
				<Avatar name={name} size="md" marginRight={4} bg="teal.500">
					{nameInitial}
				</Avatar>
			)}
			<Text fontSize="18px">{name}</Text>
		</Box>
	);
};
