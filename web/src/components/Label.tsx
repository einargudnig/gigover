import { Tag } from '@chakra-ui/react'; // Added Tag
import { CSSProperties } from 'react';
import { colorGenerator } from '../hooks/colorGenerator';

interface LabelProps {
	text: string;
	style?: CSSProperties; // This might not be directly applicable to Chakra Tag in the same way, consider passing Chakra style props if needed.
}

export const Label = ({ text, style }: LabelProps): JSX.Element => {
	const { backgroundColor, textColor } = colorGenerator(text);

	return (
		<Tag
			bg={backgroundColor}
			color={textColor}
			fontSize="11px"
			fontWeight="bold"
			px="6px" // padding: 4px 6px -> py="4px" px="6px"
			py="4px"
			borderRadius="4px"
			style={style} // Passing through style prop, though direct Chakra props are preferred for styling
		>
			{text}
		</Tag>
	);
};
