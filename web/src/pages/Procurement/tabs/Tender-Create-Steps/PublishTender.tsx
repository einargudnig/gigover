import {
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr
} from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';
import { FileUploadType } from '../../../../models/FileUploadType';
import { TenderItem } from '../../../../models/Tender';
import { usePublishTender } from '../../../../mutations/procurement/usePublishTender';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { OtherGigoverFile } from '../../../Files/new/components/OtherFile';
import { DropZone } from '../../Offers/components/UploadTenderDocuments';
import { TenderHead } from './TenderHead';

interface PublishTenderProps {
	tenderId: number;
	onPublish: () => void;
}

export function PublishTender({ tenderId, onPublish }: PublishTenderProps) {
	const { mutateAsync, isLoading: isPublishLoading, isError, error } = usePublishTender();

	const { data, isLoading } = useGetTenderById(tenderId);
	const tender = data?.tender;

	const tenderItems: TenderItem[] | undefined = tender?.items;
	// TODO: tender documents not displayng after being added with dropzone
	const tenderDocuments = tender?.documents;
	console.log('tenderDocuments', tenderDocuments);

	// publish the tender and navigate to next step!
	const handlePublish = async () => {
		const publishTenderBody = {
			tenderId: Number(tenderId)
		};
		try {
			await mutateAsync(publishTenderBody);

			onPublish();
		} catch (e) {
			console.log('ERROR', { e });
		}
	};

	return (
		<Box backgroundColor={'white'} py={6} rounded={'md'}>
			<Flex justifyContent={'center'}>
				<Heading size={'md'}>Publish Tender</Heading>
			</Flex>

			<Box px={10} py={4}>
				<TenderHead tender={tender} getTenderLoading={isLoading} />
				<Table variant={'striped'}>
					<Thead>
						<Tr>
							<Th width={'20%'}>
								<Tooltip hasArrow label="Cost code">
									<HStack>
										<Text>Number</Text>
										<ImportantIcon size={20} />
									</HStack>
								</Tooltip>
							</Th>

							<Th width={'20%'}>
								<Tooltip hasArrow label="Description of a item">
									<HStack>
										<Text>Description</Text>
										<ImportantIcon size={20} />
									</HStack>
								</Tooltip>
							</Th>

							<Th width={'20%'}>
								<Tooltip hasArrow label="Volume">
									<HStack>
										<Text color={'black'}>Volume</Text>
										<ImportantIcon size={20} />
									</HStack>
								</Tooltip>
							</Th>

							<Th width={'20%'}>
								<Tooltip
									hasArrow
									label="Unit of measurement. For example: m2, kg, t"
								>
									<HStack>
										<Text>Unit</Text>
										<ImportantIcon size={20} />
									</HStack>
								</Tooltip>
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						<>
							{tenderItems?.map((item) => (
								<Tr key={item.tenderItemId}>
									<Td width={'20%'}>{item.nr}</Td>
									<Td width={'20%'}>{item.description}</Td>
									<Td width={'20%'}>{item.volume}</Td>
									<Td width={'20%'}>{item.unit}</Td>
								</Tr>
							))}
						</>
					</Tbody>
				</Table>
			</Box>

			<Box p={2}>
				<DropZone
					propertyId={0}
					offerId={0}
					projectId={0}
					uploadType={FileUploadType.Tender}
					tenderId={tenderId}
				/>
			</Box>
			<Flex justify={'center'}>
				<Text>Add files to the Tender before you publish it</Text>
			</Flex>

			<Box>
				{tenderDocuments!
					.sort((a, b) => (b.created && a.created ? b.created - a.created : -1))
					.map((p, pIndex) => (
						<OtherGigoverFile key={pIndex} showDelete={false} file={p} />
					))}
			</Box>

			{isError && (
				<Box rounded={'md'} border={'1px'} borderColor={'red.200'} p={4}>
					<Text color={'red.400'}>
						{error.errorCode} - {error.errorText}
					</Text>
				</Box>
			)}

			<Box>
				<Flex justifyContent={'end'}>
					<Button
						variant={'outline'}
						colorScheme={'black'}
						onClick={handlePublish}
						mr={'2'}
					>
						{isPublishLoading ? <LoadingSpinner /> : 'Publish Tender'}
					</Button>
				</Flex>
			</Box>
		</Box>
	);
}
