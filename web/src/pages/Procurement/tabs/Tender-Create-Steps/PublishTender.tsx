import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { FileUploadType } from '../../../../models/FileUploadType';
import { TenderItem } from '../../../../models/Tender';
import { usePublishTender } from '../../../../mutations/procurement/usePublishTender';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { OtherGigoverFile } from '../../../Files/new/components/OtherFile';
import { DropZone } from '../../Offers/components/UploadTenderDocuments';
import { DataTable } from '../../components/Table';
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

	const columns = [
		{ header: 'Number', accessor: 'nr', tooltip: 'Code', width: '20%' },
		{
			header: 'Description',
			accessor: 'description',
			tooltip: 'Description of a item',
			width: '20%'
		},
		{ header: 'Volume', accessor: 'volume', tooltip: 'Volume', width: '20%' },
		{
			header: 'Unit',
			accessor: 'unit',
			tooltip: 'Unit of measurement. For example: m2, kg, t',
			width: '20%'
		}
	];

	return (
		<Box backgroundColor={'white'} py={6} rounded={'md'}>
			<Flex justifyContent={'center'}>
				<Heading size={'md'}>Publish Tender</Heading>
			</Flex>

			<Box px={10} py={4}>
				<TenderHead tender={tender} getTenderLoading={isLoading} />
				<DataTable columns={columns} data={tenderItems || []} />
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
