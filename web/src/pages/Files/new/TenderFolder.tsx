import React from 'react';
import styled, { css } from 'styled-components';
import { CardBaseLink } from '../../../components/CardBase';
import { FolderIcon } from '../../../components/icons/FolderIcon';
import { colorGenerator } from '../../../hooks/colorGenerator';
import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

const FolderCard = styled(CardBaseLink)<{ selected?: boolean }>`
	${(props) =>
		props.selected &&
		css`
			background: #000;
			color: #fff !important;
			box-shadow: none;
		`};
`;

export const TenderFolder = (): JSX.Element => {
	const isUploading = false;
	return (
		<>
			<FolderCard to={'/tender/tenders'}>
				<VStack align={'stretch'} spacing={4}>
					<HStack justify={'space-between'} align={'center'}>
						<FolderIcon size={38} color={'blue'} />
						{isUploading && <LoadingSpinner color={'white'} />}
					</HStack>
					<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
						Tenders
					</Heading>
					<HStack justify={'space-between'}>
						{/* {isLoading ? <LoadingSpinner /> : <Text>{data.length} Files</Text>} */}
						<Text>0 Files</Text>
					</HStack>
				</VStack>
			</FolderCard>

			<FolderCard to={'/tender/offers'}>
				<VStack align={'stretch'} spacing={4}>
					<HStack justify={'space-between'} align={'center'}>
						<FolderIcon size={38} color={'green'} />
						{isUploading && <LoadingSpinner color={'white'} />}
					</HStack>
					<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
						Offers
					</Heading>
					<HStack justify={'space-between'}>
						{/* {isLoading ? <LoadingSpinner /> : <Text>{data.length} Files</Text>} */}
						<Text>0 Files</Text>
					</HStack>
				</VStack>
			</FolderCard>
		</>
	);
};
