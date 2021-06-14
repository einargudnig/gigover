import { FileDocument } from '../services/FileSystemService';

export type FileType = 'txt' | 'other' | 'video' | 'picture' | 'drawing' | 'pdf' | 'document';

export interface IFile {
	imageId?: string;
	projectId: number;
	name: string;
	bytes?: number;
	created?: number; // Timestamp
	type: FileType;
	previewImage: string;
	url: string;
}

export class ProjectFile implements IFile {
	imageId?: string;
	filePath?: string;
	bytes?: number;
	created?: number;
	type: FileType;
	projectId: number;
	previewImage: string;
	name: string;
	url: string;

	constructor(fileDocument: FileDocument) {
		this.imageId = fileDocument.fileId;
		this.filePath = fileDocument.filePath;
		this.bytes = fileDocument.size;
		this.created = fileDocument.created;
		this.type = fileDocument.fileType;
		this.name = fileDocument.fileName;
		this.previewImage = fileDocument.fileName;
		this.projectId = fileDocument.projectId;
		this.url = fileDocument.downloadUrl;
	}
}
