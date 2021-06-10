type DocumentTypeImage = 0;
type DocumentTypeVideo = 1;
type DocumentTypeDoc = 2;

export interface ProjectImage {
	imageId: number;
	projectId: number;
	folderId: number;
	name: string;
	type: DocumentTypeImage | DocumentTypeVideo | DocumentTypeDoc;
	previewImage: string;
	url: string;
	created: number;
}
