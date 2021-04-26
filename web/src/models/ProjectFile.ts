import { FileDocument } from '../services/FileSystemService';

export type FileType = 'txt' | 'other' | 'video' | 'picture' | 'drawing' | 'pdf' | 'document';

export interface IFile {
	fileId: string;
	name: string;
	bytes: number;
	created: number; // Timestamp
	projectId: number;
	fileType: FileType;
	downloadUrl: string;
}

export class ProjectFile implements IFile {
	fileId: string;
	filePath: string;
	bytes: number;
	created: number;
	fileType: FileType;
	projectId: number;
	name: string;
	downloadUrl: string;

	constructor(fileDocument: FileDocument) {
		this.fileId = fileDocument.fileId;
		this.filePath = fileDocument.filePath;
		this.bytes = fileDocument.size;
		this.created = fileDocument.created;
		this.fileType = fileDocument.fileType;
		this.name = fileDocument.fileName;
		this.projectId = fileDocument.projectId;
		this.downloadUrl = fileDocument.downloadUrl;
	}
}
