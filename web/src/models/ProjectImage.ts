type DocumentTypeImage = 0 | 'IMAGE';
type DocumentTypeVideo = 1 | 'VIDEO';
type DocumentTypeDoc = 2 | 'DOCUMENT';

export type DocumentTypes = DocumentTypeImage | DocumentTypeVideo | DocumentTypeDoc;

export interface ProjectImage {
	imageId: number;
	projectId: number;
	folderId: number;
	taskId?: number;
	name: string;
	type: DocumentTypes;
	previewImage: string;
	url: string;
	created: number;
	bytes: number;
}
