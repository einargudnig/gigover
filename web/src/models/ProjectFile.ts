import { FileDocument } from '../services/FileSystemService';

export type FileType = 'txt' | 'other' | 'video' | 'picture' | 'drawing' | 'pdf' | 'document';

export interface IFile {
	fileId: string;
	name: string;
	bytes: number;
	created: number; // Timestamp
	projectId: number;
	fileType: FileType;
}

export class ProjectFile implements IFile {
	fileId: string;
	bytes: number;
	created: number;
	fileType: FileType;
	projectId: number;
	name: string;

	constructor(projectId: number, fileDocument: FileDocument) {
		this.fileId = fileDocument.filePath;
		this.bytes = fileDocument.size;
		this.created = fileDocument.created;
		this.fileType = 'picture'; // TODO
		this.name = fileDocument.fileName;
		this.projectId = projectId;
	}
}
