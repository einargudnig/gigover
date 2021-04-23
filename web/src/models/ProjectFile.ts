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

	constructor(
		documentId: string,
		bytes: number,
		created: number,
		fileType: FileType,
		name: string,
		projectId: number
	) {
		this.fileId = documentId;
		this.bytes = bytes;
		this.created = created;
		this.fileType = fileType;
		this.name = name;
		this.projectId = projectId;
	}
}
